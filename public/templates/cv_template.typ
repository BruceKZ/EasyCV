#import "chicv.typ": *

// Helper functions for rendering each section
#let render_education(private_info, labels, scope) = {
  if private_info.at("education", default: ()).len() > 0 {
    [== #fa[#graduation-cap] #labels.education]

    for edu in private_info.at("education", default: ()) {
        let school = edu.at("school", default: "")
        let time = edu.at("time", default: "")
        let degree = edu.at("degree", default: "")
        let details = edu.at("details", default: ())
        
        cventry(
            tl: school,
            tr: time,
        )[
            #if degree != "" and degree != none {
               eval(degree, mode: "markup", scope: scope)
               linebreak()
            }
            #if details != none and details != () {
                eval(details.join("\n"), mode: "markup", scope: scope)
            }
        ]
    }
  }
}

#let render_work(private_info, labels, scope) = {
  if private_info.at("work", default: ()).len() > 0 {
    [== #fa[#briefcase] #labels.work]

    for w in private_info.at("work", default: ()) {
        let company = w.at("company", default: "")
        let team = w.at("team", default: "")
        let role = w.at("role", default: "")
        let time = w.at("time", default: "")
        let details = w.at("details", default: ())

        cventry(
            tl: company,
            bl: team,
            br: role,
            tr: time
        )[
            #if details != none and details != () {
                eval(details.join("\n"), mode: "markup", scope: scope)
            }
        ]
    }
  }
}

#let render_projects(private_info, labels, scope) = {
  if private_info.at("projects", default: ()).len() > 0 {
    [== #fa[#project-diagram] #labels.projects]

    for p in private_info.at("projects", default: ()) {
        let name = p.at("name", default: "")
        let description = p.at("description", default: "")
        let tech_stack = p.at("tech_stack", default: "")
        let link = p.at("link", default: "")
        let details = p.at("details", default: ())

        if name == "" { continue }
        cventry(
            tl: name,
            bl: description,
            br: tech_stack,
            tr: if link != "" and link != none {
                if link.starts-with("https://github.com/") {
                    let repo = link.replace("https://github.com/", "")
                    ghrepo(repo)
                } else {
                    eval(link, mode: "markup", scope: scope)
                }
            } else { none },
        )[
            #if details != none and details != () {
                eval(details.map(d => "- " + d).join("\n"), mode: "markup", scope: scope)
            }
        ]
    }
  }

  if private_info.at("other_projects", default: ()).len() > 0 {
    cventry(
        tl: [#labels.other_projects],
    )[
        #eval(private_info.at("other_projects", default: ()).join("\n"), mode: "markup", scope: scope)
    ]
  }

  if private_info.at("open_source", default: ()).len() > 0 {
    cventry(
        tl: [#fa[#code.branch] #labels.open_source],
    )[
        #eval(private_info.at("open_source", default: ()).join("\n"), mode: "markup", scope: scope)
    ]
  }
}

#let render_skills(private_info, labels, scope) = {
  if private_info.at("skills", default: ()).len() > 0 {
    [== #fa[#laptop.code] #labels.skills]

    grid(
        columns: (auto, auto),
        align: (right, left),
        row-gutter: 11pt,
        gutter: 8pt,
        ..private_info.at("skills", default: ()).map(s => {
            let key = s.at("key", default: "")
            let value = s.at("value", default: "")
            if key != "" and key != none {
                (
                    strong(eval(key, mode: "markup", scope: scope)),
                    eval(value, mode: "markup", scope: scope)
                )
            } else {
                ()
            }
        }).flatten()
    )
  }
}

#let render_awards(private_info, labels, scope) = {
  if private_info.at("awards", default: ()).len() > 0 {
    [== #fa[#trophy] #labels.awards]

    let awards = private_info.at("awards", default: ())
    if awards != none and awards != () {
        eval(awards.map(a => "- " + a).join("\n"), mode: "markup", scope: scope)
    }
  }
}

#let render_misc(private_info, labels, scope) = {
  if private_info.at("misc", default: ()).len() > 0 {
    [== #fa[#th.list] #labels.misc]

    eval(private_info.at("misc", default: ()).map(m => "- " + m).join("\n"), mode: "markup", scope: scope)
  }
}

#let cv(private_info, labels, section_order: ()) = {
  show: chicv
  set par(justify: true, leading: 0.7em)
  set list(marker: ([•], [‣]), spacing: 0.75em)

  let basics = private_info.at("basics", default: (:))
  let resume_name = basics.at("name", default: "")
  let resume_phone = basics.at("phone", default: "")
  let resume_email = basics.at("email", default: "")
  let resume_github = basics.at("github", default: "")
  let resume_website = basics.at("website", default: "")
  let resume_linkedin = basics.at("linkedin", default: "")

  let scope = (
      redact: redact,
      fa: fa,
      link: link,
      emph: emph,
      linebreak: linebreak,
      ghrepo: ghrepo,
      phone: phone,
      envelope: envelope,
      github: github,
      globe: globe,
      linkedin: linkedin,
      graduation-cap: graduation-cap,
      briefcase: briefcase,
      project-diagram: project-diagram,
      code: code,
      laptop: laptop,
      th: th,
      trophy: trophy,
      rust: rust,
  )

  // Basics section (always first)
  [= #redact(alter: "roife")[#resume_name]]

  let contact_info = ()
  if resume_phone != "" { contact_info.push([#fa[#phone] #redact(mark: true)[#resume_phone]]) }
  if resume_email != "" { contact_info.push([#fa[#envelope] #resume_email]) }
  if resume_github != "" { contact_info.push([#fa[#github] #link("https://github.com/" + resume_github)[#resume_github]]) }
  if resume_website != "" { contact_info.push([#fa[#globe] #link("https://" + resume_website)[#resume_website]]) }
  if resume_linkedin != "" { contact_info.push([#fa[#linkedin] #link("https://" + resume_linkedin)[#resume_linkedin]]) }

  contact_info.join(" | ")

  // Render sections in the specified order
  for section_id in section_order {
    if section_id == "education" {
      render_education(private_info, labels, scope)
    } else if section_id == "work" {
      render_work(private_info, labels, scope)
    } else if section_id == "projects" {
      render_projects(private_info, labels, scope)
    } else if section_id == "skills" {
      render_skills(private_info, labels, scope)
    } else if section_id == "awards" {
      render_awards(private_info, labels, scope)
    } else if section_id == "misc" {
      render_misc(private_info, labels, scope)
    }
  }
}
