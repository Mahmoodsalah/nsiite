import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Bot,
  Cloud,
  Eye,
} from "lucide-react";
import { SiLinkedin, SiYoutube, SiX, SiFacebook } from "react-icons/si";
import NetworkBg from "@/components/network-bg";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";
import mahmoodImg from "@assets/mahmood.jpg";

const coreCompetencies = [
  { label: "Deep Learning", icon: Brain },
  { label: "AI Agents", icon: Bot },
  { label: "Cloud Computing", icon: Cloud },
  { label: "Computer Vision", icon: Eye },
];

const projects = [
  {
    title: "Video Analytics Solution",
    description:
      "Developed an AI-powered video analytics platform integrating hardware, software, and cloud solutions",
    tags: ["Python", "AI", "Cloud", "Computer Vision"],
  },
  {
    title: "Sales Forecasting Optimization",
    description:
      "Created a machine learning model to predict sales trends, optimizing inventory management and reducing stockouts by 20%",
    tags: ["Python", "AWS", "Machine Learning", "Data Analysis"],
  },
  {
    title: "Garbage Detection System",
    description:
      "Designed a computer vision system to detect and classify garbage types using deep neural networks",
    tags: ["Computer Vision", "Deep Learning", "Python", "Neural Networks"],
  },
  {
    title: "Autonomous Drone Navigation",
    description:
      "Implemented a real-time object detection and tracking system for autonomous drone navigation in urban environments, achieving 95% accuracy",
    tags: ["Computer Vision", "YOLO", "ROS", "Drone Technology"],
  },
  {
    title: "Medical Image Analysis AI",
    description:
      "Developed a deep learning system for automated diagnosis of medical conditions from X-ray images, reducing diagnosis time by 60%",
    tags: ["Computer Vision", "PyTorch", "Medical Imaging", "CNN"],
  },
  {
    title: "Smart Retail Assistant",
    description:
      "Created an AI agent for retail customer service, handling product inquiries and recommendations with NLP, improving satisfaction by 40%",
    tags: ["NLP", "LangChain", "OpenAI", "Python"],
  },
  {
    title: "Facial Recognition Security System",
    description:
      "Built an enterprise-grade facial recognition system with anti-spoofing capabilities, processing real-time video streams with 99.9% accuracy",
    tags: ["Computer Vision", "TensorFlow", "Face Recognition", "Anti-spoofing"],
  },
  {
    title: "AI Document Processing Agent",
    description:
      "Developed an intelligent document processing system using AI agents to extract, classify, and analyze complex business documents, reducing manual processing time by 85%",
    tags: ["AI Agents", "OCR", "NLP", "Document Analysis"],
  },
  {
    title: "Autonomous Quality Control",
    description:
      "Implemented a computer vision system for manufacturing quality control, detecting defects in real-time with 99.5% accuracy",
    tags: ["Computer Vision", "Quality Control", "Industrial IoT", "Deep Learning"],
  },
];

const testimonials = [
  {
    name: "Rana Chakrabarti",
    title: "Director of Learning Experiences at SAP Academy for Engineering",
    image: "https://mahmoodsalah.github.io/testimonials/rana.jpg",
    text: "I met Mahmood as a part of the cohort from Bahrain that attended the Multi-Dimensional Engineers Program at SAP Silicon Valley. Mahmood represents all these core values. He is insatiably curious, has a high tolerance for risk, is a skilled technologist, a gifted storyteller, and a team mate everyone wants to work with.",
  },
  {
    name: "Poorna Shivaprakasha",
    title: "Analytics & PMO Lead at SAP Academy for Engineering",
    image: "https://mahmoodsalah.github.io/testimonials/poorna.jpg",
    text: "Working with Mahmood during our SAP Academy training program was a privilege. His expertise in large language models, data science, and software development stood out, as did his innovative Hackathon project.",
  },
  {
    name: "Abdelrehim Ahmed",
    title: "Co-Founder & CTO @ Stealth Mode AI Startup",
    image: "https://mahmoodsalah.github.io/testimonials/abdelrehim.jpg",
    text: "I have worked with Mahmood for more than 6 years on several projects. Mahmood really stands out as a machine learning expert. He is always learning new techniques and working hard to stay up to date with the latest trends.",
  },
  {
    name: "Omnia Nour",
    title: "Branch Manager at Information Technology Institute (ITI)",
    image: "https://mahmoodsalah.github.io/testimonials/omnia.jpg",
    text: "Mahmood has a great enthusiasm and the ability to work in groups. He also has a bright mind that could use it in solve many problems, great personality and he is loved by people around him.",
  },
];

const experience = [
  {
    role: "Senior Data Scientist",
    company: "Innova",
    period: "July 2019 - Present",
    points: [
      "Utilized Python programming languages and tech stacks like NumPy, Pandas, TensorFlow, and Scikit-learn",
      "Designed predictive models and analyzed datasets to extract actionable insights",
      "Collaborated with cross-functional teams to identify and solve business challenges",
    ],
  },
  {
    role: "AI Mentor",
    company: "Udacity",
    period: "January 2018 - Present",
    points: [
      "Mentored students in AI for Healthcare and Self-Driving Car Engineering programs",
      "Reviewed technical assignments and provided feedback on deep learning and computer vision projects",
    ],
  },
  {
    role: "Research Analyst (Internship)",
    company: "Digital Opportunity Trust",
    period: "March 2016 - June 2016",
    points: [
      "Analyzed survey data to assess the impact of technology in diverse regions",
      "Employed R tools to present findings, enabling stakeholders to make data-driven decisions",
    ],
  },
];

const education = [
  {
    degree: "Self-Driving Car Engineer Nanodegree",
    school: "Udacity",
    year: "2017",
  },
  {
    degree: "BSc in Computer Science and Information Systems",
    school: "Suez Canal University",
    year: "2012",
  },
];

const leadership = [
  {
    role: "Executive Team Member",
    org: "Egypt Scholars Inc.",
    period: "July 2014 - December 2023",
    desc: "Formed and managed three specialized teams, driving initiatives that improved organizational efficiency and supported hundreds of students annually",
  },
  {
    role: "Co-founder",
    org: "TROSC Team",
    period: "May 2011 - Present",
    desc: "Delivered 200+ technology-focused sessions and courses across Egypt",
  },
  {
    role: "Google Student Ambassador",
    org: "Google",
    period: "August 2011 - August 2012",
    desc: "Selected as one of 74 ambassadors in the MENA region, organized 4 technology events",
  },
];

const skills = [
  "Python", "R", "SQL", "TensorFlow", "Scikit-learn", "NumPy", "Pandas",
  "Power BI", "Matplotlib", "Seaborn", "AWS", "SAP S/4HANA",
  "SAP Analytics Cloud", "Deep Learning", "Computer Vision",
  "Machine Learning", "Project Management", "LLM", "Leadership",
  "Digital Transformation", "Entrepreneurship",
];

const socialLinks = [
  { icon: SiLinkedin, href: "#" },
  { icon: SiYoutube, href: "#" },
  { icon: SiX, href: "#" },
  { icon: SiFacebook, href: "#" },
];

export default function HireMe() {
  useEffect(() => {
    if (window.location.hash === "#about") {
      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <NetworkBg />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32">
          <h1
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6 animate-fade-in-up"
            data-testid="text-hero-title"
          >
            Senior Data Scientist, AI Engineer, and Consultant
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
            I specialize in leveraging advanced data science techniques and AI
            engineering to drive innovative solutions for complex business
            challenges. As a consultant and mentor, I help organizations transform
            through the strategic adoption of AI technologies.
          </p>
          <div className="flex justify-center gap-3 animate-fade-in-up animation-delay-400">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200"
                data-testid={`link-hero-social-${i}`}
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <div id="about" className="max-w-6xl mx-auto px-6 py-16">
        <div className="space-y-24">
          <AboutSection />
          <ProjectsSection />
          <ResumeSection />
          <TestimonialsSection />
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <AnimateIn>
      <section data-testid="section-about">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div className="md:col-span-1 flex justify-center">
            <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-primary/20 animate-scale-in">
              <img
                src={mahmoodImg}
                alt="Mahmood Salah"
                className="w-full h-full object-cover"
                data-testid="img-profile"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-heading font-bold text-3xl text-foreground mb-4">
              About Me
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Senior Data Scientist and AI Engineer specializing in AI agents,
              computer vision, and deep learning technologies. I develop innovative
              AI solutions that drive measurable business value.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              As an AI Mentor at Udacity, I guide students through advanced programs
              while sharing expertise in cutting-edge technologies.
            </p>

            <h3 className="font-heading font-semibold text-xl text-foreground mb-4">
              Core Competencies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {coreCompetencies.map((comp, i) => (
                <Card key={comp.label} className="text-center hover:border-primary/30 transition-colors duration-300">
                  <CardContent className="py-6 px-4">
                    <comp.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {comp.label}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimateIn>
  );
}

function ProjectsSection() {
  return (
    <AnimateIn>
      <section data-testid="section-projects">
        <h2 className="font-heading font-bold text-3xl text-foreground mb-2">
          Projects
        </h2>
        <p className="text-muted-foreground mb-8">
          A selection of my recent work in AI and business transformation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <AnimateIn key={i} delay={i * 0.05}>
              <Card className="hover-elevate group hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>
          ))}
        </div>
      </section>
    </AnimateIn>
  );
}

function ResumeSection() {
  return (
    <AnimateIn>
      <section data-testid="section-resume">
        <h2 className="font-heading font-bold text-3xl text-foreground mb-6">
          Resume
        </h2>
        <div className="w-full rounded-lg overflow-hidden border border-border bg-card">
          <iframe
            src="https://drive.google.com/file/d/1BxS8LJiIp8y_CYk5Vw7dMbHc8IaFEjNe/preview"
            className="w-full h-[800px]"
            allow="autoplay"
            title="Mahmood Salah Resume"
            data-testid="iframe-resume"
          />
        </div>
        <p className="text-muted-foreground text-sm mt-3 text-center">
          Can't see the resume? <a href="https://drive.google.com/file/d/1BxS8LJiIp8y_CYk5Vw7dMbHc8IaFEjNe/view" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open in Google Drive</a>
        </p>
      </section>
    </AnimateIn>
  );
}

function TestimonialsSection() {
  return (
    <AnimateIn>
      <section data-testid="section-testimonials">
        <h2 className="font-heading font-bold text-3xl text-foreground mb-2">
          Testimonials
        </h2>
        <p className="text-muted-foreground mb-8">
          What others say about working with me
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <AnimateIn key={i} delay={i * 0.1}>
              <Card className="hover:border-primary/20 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      data-testid={`img-testimonial-${i}`}
                    />
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">
                        {t.name}
                      </h3>
                      <p className="text-muted-foreground text-xs">{t.title}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    "{t.text}"
                  </p>
                </CardContent>
              </Card>
            </AnimateIn>
          ))}
        </div>
      </section>
    </AnimateIn>
  );
}

