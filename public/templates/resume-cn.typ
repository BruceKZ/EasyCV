#import "cv_template.typ": cv

#let private_info = json("resume-private/private_info.json")

#let labels = (
    education: "教育经历",
    work: "工作经历",
    awards: "获奖情况",
    projects: "项目经历",
    other_projects: "其他个人项目",
    open_source: "开源贡献",
    skills: "技能",
    misc: "其他"
)

#cv(private_info, labels)
