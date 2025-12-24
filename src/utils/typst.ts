import type { ResumeData } from '../stores/resume'

export async function compileResume(templateName: string, data: ResumeData, sectionOrder: string[]): Promise<string> {
  // 1. Fetch all necessary files
  const [templateRes, cvTemplateRes, chicvRes, fontawesomeRes] = await Promise.all([
    fetch(`/templates/${templateName}`),
    fetch('/templates/cv_template.typ'),
    fetch('/templates/chicv.typ'),
    fetch('/templates/fontawesome.typ')
  ])

  let template = await templateRes.text()
  let cvTemplate = await cvTemplateRes.text()
  let chicv = await chicvRes.text()
  const fontawesome = await fontawesomeRes.text()

  // 2. Inline fontawesome into chicv
  chicv = chicv.replace('#import "fontawesome.typ": *', fontawesome)

  // 3. Inline chicv into cv_template
  cvTemplate = cvTemplate.replace('#import "chicv.typ": *', chicv)

  // 4. Inline cv_template into main template
  // The import in resume-cn.typ is: #import "cv_template.typ": cv
  // We need to replace this with the content of cv_template.
  // However, cv_template defines a function 'cv'.
  // If we just paste the content, 'cv' will be available in the scope.
  // But we need to remove the import line.
  template = template.replace('#import "cv_template.typ": cv', cvTemplate)

  // 5. Inject data
  const jsonString = JSON.stringify(data)
  const escapedJsonString = jsonString.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  
  const jsonImportRegex = /#let\s+private_info\s*=\s*json\s*\(".*?"\)/
  
  if (jsonImportRegex.test(template)) {
    template = template.replace(jsonImportRegex, `#let private_info = json(bytes("${escapedJsonString}"))`)
  } else {
    console.warn('Could not find json import in template')
  }

  // 6. Inject section order
  const sectionOrderString = JSON.stringify(sectionOrder)
  const escapedSectionOrderString = sectionOrderString.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  
  const sectionOrderImportRegex = /#let\s+section_order\s*=\s*json\s*\(".*?"\)/
  
  if (sectionOrderImportRegex.test(template)) {
    template = template.replace(sectionOrderImportRegex, `#let section_order = json(bytes("${escapedSectionOrderString}"))`)
  } else {
    console.warn('Could not find section_order import in template')
  }

  return template
}

export async function exportPdf(source: string): Promise<Uint8Array> {
  // Use the $typst helper from @myriaddreamin/typst.ts
  // This assumes $typst has been initialized (which happens in Preview.vue)
  // If we need to ensure initialization, we might need to expose the init logic or check it here.
  // For now, since the user is likely on the page where Preview is loaded, it should be fine.
  
  // However, to be safe, we should import $typst here.
  const { $typst } = await import('@myriaddreamin/typst.ts')
  
  // Compile to PDF
  const artifact = await $typst.pdf({ mainContent: source })
  if (!artifact) {
    throw new Error('Failed to generate PDF artifact')
  }
  return artifact
}
