import Hero from '../components/Hero'
import About from '../components/About'
import WIE from '../components/WIE'
import Projects from '../components/Projects'
import Experience from '../components/Experience'
import Contact from '../components/Contact'

// Single source for navbar, PageNav, tab transitions, and ⌘K tab group.
// Order is the left-to-right / prev-next sequence.
export const tabs = [
  {
    id: 'home',
    label: 'Home',
    component: Hero,
    accent: '#E8521A',
    hint: 'Name, tagline, resume',
  },
  {
    id: 'about',
    label: 'About',
    component: About,
    accent: '#2A4BCC',
    hint: 'Bio, photos, beyond',
  },
  {
    id: 'wie',
    label: 'IEEE WIE',
    component: WIE,
    accent: '#9B5DE5',
    hint: 'Workshops, hackathon, mentorship',
  },
  {
    id: 'projects',
    label: 'Projects',
    component: Projects,
    accent: '#1A6B45',
    hint: 'Selected work',
  },
  {
    id: 'experience',
    label: 'Experience',
    component: Experience,
    accent: '#F15BB5',
    hint: 'Work timeline',
  },
  {
    id: 'contact',
    label: 'Contact',
    component: Contact,
    accent: '#F7A68A',
    hint: 'Email + links',
  },
]
