export interface Publication {
  title: string
  authors: string[]
  authorship: string
  abstract: string
  venue: string
  conference: string[]
  type: string[]
  link: string
  year: string
  website: string
  video: string
  poster: string
  award: string
  twitter: string
  github: string
  presentation: string
  location: string
  badges: string
}

export interface Experience {
  title: string
  points: string[]
  location: string
  image: string
  date: string
}

export interface Talk {
  date: string
  title: string
  role: string
  inst: string
  link: string
  slides: string
  badges: string
}

export interface AwardCategory {
  category: string
  awards: Award[]
}

export interface Award {
  year: string
  name: string
  link: string
}

export interface PeopleCategory {
  category: string
  people: Person[]
}

export interface Person {
  inst: string
  name: string
  link: string
}

export interface ReviewConf {
  name: string
  link: string
  tracks: string[]
  role: string
}

export interface ReviewWorkshop {
  name: string
  link: string
  conference: string
  role: string
}

export interface ReviewData {
  journals: ReviewConf[]
  conferences: ReviewConf[]
  workshops: ReviewWorkshop[]
}

export interface Project {
  name: string
  link: string
  code: string
  blog: string
  desc: string
  collaborators: string[]
}

export interface NewsItem {
  date: string
  html: string
}
