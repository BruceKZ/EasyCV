#import "cv_template.typ": cv

#let private_info = json("resume-private/private_info.json")
#let section_order = json("resume-private/section_order.json")

#let labels = (
    education: "Education",
    work: "Work Experience",
    awards: "Awards",
    projects: "Projects",
    other_projects: "Other Personal Projects",
    open_source: "Open Source Contributions",
    skills: "Skills",
    misc: "Misc"
)

#cv(private_info, labels, section_order: section_order)
