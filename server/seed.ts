import { db } from "./db";
import { siteContent } from "@shared/schema";
import { eq, and } from "drizzle-orm";

async function upsert(page: string, section: string, contentKey: string, value: any) {
  const existing = await db
    .select()
    .from(siteContent)
    .where(
      and(
        eq(siteContent.page, page),
        eq(siteContent.section, section),
        eq(siteContent.contentKey, contentKey)
      )
    );

  if (existing.length > 0) {
    await db.update(siteContent).set({ value }).where(eq(siteContent.id, existing[0].id));
  } else {
    await db.insert(siteContent).values({ page, section, contentKey, value });
  }
}

async function seed() {
  console.log("Seeding site content...");

  await upsert("hireme", "hero", "title", "Senior Data Scientist, AI Engineer, and Consultant");
  await upsert("hireme", "hero", "subtitle", "I specialize in leveraging advanced data science techniques and AI engineering to drive innovative solutions for complex business challenges. As a consultant and mentor, I help organizations transform through the strategic adoption of AI technologies.");
  await upsert("hireme", "hero", "socialLinks", [
    { platform: "linkedin", href: "#" },
    { platform: "youtube", href: "#" },
    { platform: "x", href: "#" },
    { platform: "facebook", href: "#" },
  ]);

  await upsert("hireme", "about", "title", "About Me");
  await upsert("hireme", "about", "bio1", "Senior Data Scientist and AI Engineer specializing in AI agents, computer vision, and deep learning technologies. I develop innovative AI solutions that drive measurable business value.");
  await upsert("hireme", "about", "bio2", "As an AI Mentor at Udacity, I guide students through advanced programs while sharing expertise in cutting-edge technologies.");
  await upsert("hireme", "about", "coreCompetencies", [
    { label: "Deep Learning", icon: "Brain" },
    { label: "AI Agents", icon: "Bot" },
    { label: "Cloud Computing", icon: "Cloud" },
    { label: "Computer Vision", icon: "Eye" },
  ]);

  await upsert("hireme", "projects", "title", "Projects");
  await upsert("hireme", "projects", "subtitle", "A selection of my recent work in AI and business transformation.");
  await upsert("hireme", "projects", "items", [
    { title: "Video Analytics Solution", description: "Developed an AI-powered video analytics platform integrating hardware, software, and cloud solutions", tags: ["Python", "AI", "Cloud", "Computer Vision"] },
    { title: "Sales Forecasting Optimization", description: "Created a machine learning model to predict sales trends, optimizing inventory management and reducing stockouts by 20%", tags: ["Python", "AWS", "Machine Learning", "Data Analysis"] },
    { title: "Garbage Detection System", description: "Designed a computer vision system to detect and classify garbage types using deep neural networks", tags: ["Computer Vision", "Deep Learning", "Python", "Neural Networks"] },
    { title: "Autonomous Drone Navigation", description: "Implemented a real-time object detection and tracking system for autonomous drone navigation in urban environments, achieving 95% accuracy", tags: ["Computer Vision", "YOLO", "ROS", "Drone Technology"] },
    { title: "Medical Image Analysis AI", description: "Developed a deep learning system for automated diagnosis of medical conditions from X-ray images, reducing diagnosis time by 60%", tags: ["Computer Vision", "PyTorch", "Medical Imaging", "CNN"] },
    { title: "Smart Retail Assistant", description: "Created an AI agent for retail customer service, handling product inquiries and recommendations with NLP, improving satisfaction by 40%", tags: ["NLP", "LangChain", "OpenAI", "Python"] },
    { title: "Facial Recognition Security System", description: "Built an enterprise-grade facial recognition system with anti-spoofing capabilities, processing real-time video streams with 99.9% accuracy", tags: ["Computer Vision", "TensorFlow", "Face Recognition", "Anti-spoofing"] },
    { title: "AI Document Processing Agent", description: "Developed an intelligent document processing system using AI agents to extract, classify, and analyze complex business documents, reducing manual processing time by 85%", tags: ["AI Agents", "OCR", "NLP", "Document Analysis"] },
    { title: "Autonomous Quality Control", description: "Implemented a computer vision system for manufacturing quality control, detecting defects in real-time with 99.5% accuracy", tags: ["Computer Vision", "Quality Control", "Industrial IoT", "Deep Learning"] },
  ]);

  await upsert("hireme", "resume", "title", "Resume");
  await upsert("hireme", "resume", "embedUrl", "https://drive.google.com/file/d/1BxS8LJiIp8y_CYk5Vw7dMbHc8IaFEjNe/preview");
  await upsert("hireme", "resume", "viewUrl", "https://drive.google.com/file/d/1BxS8LJiIp8y_CYk5Vw7dMbHc8IaFEjNe/view");

  await upsert("hireme", "testimonials", "title", "Testimonials");
  await upsert("hireme", "testimonials", "subtitle", "What others say about working with me");
  await upsert("hireme", "testimonials", "items", [
    { name: "Rana Chakrabarti", title: "Director of Learning Experiences at SAP Academy for Engineering", image: "https://mahmoodsalah.github.io/testimonials/rana.jpg", text: "I met Mahmood as a part of the cohort from Bahrain that attended the Multi-Dimensional Engineers Program at SAP Silicon Valley. Mahmood represents all these core values. He is insatiably curious, has a high tolerance for risk, is a skilled technologist, a gifted storyteller, and a team mate everyone wants to work with." },
    { name: "Poorna Shivaprakasha", title: "Analytics & PMO Lead at SAP Academy for Engineering", image: "https://mahmoodsalah.github.io/testimonials/poorna.jpg", text: "Working with Mahmood during our SAP Academy training program was a privilege. His expertise in large language models, data science, and software development stood out, as did his innovative Hackathon project." },
    { name: "Abdelrehim Ahmed", title: "Co-Founder & CTO @ Stealth Mode AI Startup", image: "https://mahmoodsalah.github.io/testimonials/abdelrehim.jpg", text: "I have worked with Mahmood for more than 6 years on several projects. Mahmood really stands out as a machine learning expert. He is always learning new techniques and working hard to stay up to date with the latest trends." },
    { name: "Omnia Nour", title: "Branch Manager at Information Technology Institute (ITI)", image: "https://mahmoodsalah.github.io/testimonials/omnia.jpg", text: "Mahmood has a great enthusiasm and the ability to work in groups. He also has a bright mind that could use it in solve many problems, great personality and he is loved by people around him." },
  ]);

  await upsert("consultation", "hero", "title", "Need a Consultation?");
  await upsert("consultation", "hero", "subtitle", "Whether you need help with AI strategy, building ML pipelines, or transforming your business with data-driven solutions, I'm here to help. Let's discuss how I can contribute to your next project.");
  await upsert("consultation", "hero", "email", "mahmood.salah@email.com");

  await upsert("consultation", "services", "items", [
    { title: "AI Strategy", description: "Get expert guidance on integrating AI into your business workflows and operations.", icon: "Brain" },
    { title: "Computer Vision", description: "Custom solutions for image recognition, video analytics, and visual AI systems.", icon: "Eye" },
    { title: "AI Agents & LLMs Systems", description: "Build intelligent AI agents and LLMs systems that automate complex tasks and enhance productivity.", icon: "Bot" },
  ]);

  await upsert("bootcamp", "hero", "badge", "Applications Now Open");
  await upsert("bootcamp", "hero", "title", "Become the Next LLM Engineer with BootcampAI");
  await upsert("bootcamp", "hero", "subtitle", "The region's first non-profit AI bootcamp platform empowering the next generation of AI engineers through intensive, project-based learning.");
  await upsert("bootcamp", "hero", "highlights", [
    "10 Weeks of Deep AI Training",
    "Real Projects & Global Collaboration",
    "Scholarships up to 100%",
  ]);
  await upsert("bootcamp", "hero", "applyUrl", "https://forms.gle/nCeyqSxashm8Q1bv5");

  await upsert("bootcamp", "about", "title", "About BootcampAI");
  await upsert("bootcamp", "about", "description1", "BootcampAI is the first non-profit platform in the Arab region dedicated to AI education through immersive bootcamps. Our mission is to make high-quality Artificial Intelligence education accessible, practical, and career-transforming.");
  await upsert("bootcamp", "about", "description2", "We combine academic rigor with hands-on practice: every topic includes real project implementation that bridges the gap between theory and real-world solutions. Participants not only learn how AI models work but also build and deploy them under expert mentorship.");
  await upsert("bootcamp", "about", "duringBenefits", [
    "Daily mentoring from experienced AI engineers.",
    "24/7 AI-powered assistance for technical support.",
    "Weekly practical projects reinforcing each concept.",
    "A collaborative learning environment designed to inspire innovation.",
  ]);
  await upsert("bootcamp", "about", "afterBenefits", [
    "Three months of free mentorship to support further growth.",
    "Access to advanced, specialized AI courses.",
    "Real paths to commercializing their projects through European partnerships.",
  ]);

  await upsert("bootcamp", "whyChoose", "title", "Why Choose BootcampAI Programs");
  await upsert("bootcamp", "whyChoose", "subtitle", "What sets BootcampAI apart is our commitment to education with impact -- not only teaching AI but empowering learners to create, innovate, and lead in the field.");
  await upsert("bootcamp", "whyChoose", "highlights", [
    { title: "Academic + Practical Integration", desc: "Build strong theoretical and mathematical understanding with hands-on practice.", icon: "GraduationCap" },
    { title: "Project-Based Learning", desc: "Every module produces a real, portfolio-worthy project.", icon: "Puzzle" },
    { title: "Career Support & Mentorship", desc: "6 month free learning with extended mentorship and guidance after graduation.", icon: "Handshake" },
    { title: "International Collaboration", desc: "Unlock opportunities to develop and commercialize ideas with European partners.", icon: "Globe" },
    { title: "Non-Profit Scholarships", desc: "Market value: 12,000 SAR. Join for only 2,400 SAR after 80% scholarship -- or secure one of 30 full scholarships (100%).", icon: "Lightbulb" },
  ]);
  await upsert("bootcamp", "whyChoose", "cta", "Your future as an AI Engineer starts here.");

  await upsert("bootcamp", "llmBootcamp", "title", "LLM & AI Agent Bootcamp");
  await upsert("bootcamp", "llmBootcamp", "subtitle", "BootcampAI's flagship 10-week intensive program designed for professionals and learners who want to master Large Language Models (LLMs) and AI Agent frameworks.");
  await upsert("bootcamp", "llmBootcamp", "whatYoullLearn", [
    "Core mathematics and architectures behind LLMs.",
    "The mechanics of attention, tokenization, and transformers.",
    "Fine-tuning pre-trained models and building custom AI agents.",
    "Building, deploying, and optimizing real-world LLM applications.",
  ]);
  await upsert("bootcamp", "llmBootcamp", "programDetails", [
    { label: "Duration", value: "10 Weeks", icon: "Clock" },
    { label: "Support", value: "24/7 AI assistant + daily engineer mentorship", icon: "HeadphonesIcon" },
    { label: "Hands-On Projects", value: "Each week includes a working project prototype", icon: "Layers" },
  ]);
  await upsert("bootcamp", "llmBootcamp", "scholarships", [
    "30 Fully Funded Scholarships (100%)",
    "30 Partially Funded Seats (80%), reducing cost to 2,400 SAR | 630 $ only",
  ]);
  await upsert("bootcamp", "llmBootcamp", "bottomNote", "Top participants receive Technical Excellence Awards and real opportunities to commercialize their bootcamp projects with European collaborators.");

  await upsert("bootcamp", "howToApply", "title", "How to Apply");
  await upsert("bootcamp", "howToApply", "subtitle", "Applying to BootcampAI is simple:");
  await upsert("bootcamp", "howToApply", "steps", [
    "Submit your application through our official form.",
    "Complete a short technical challenge to assess readiness.",
    "Receive scholarship results and secure your seat.",
    "Begin your 10-week transformation into an AI Engineer.",
  ]);
  await upsert("bootcamp", "howToApply", "badge", "Applications are now open");
  await upsert("bootcamp", "howToApply", "cta", "Take your step toward leading the next AI revolution.");
  await upsert("bootcamp", "howToApply", "applyUrl", "https://forms.gle/ergHXAYYbaoSmFtg7");
  await upsert("bootcamp", "howToApply", "applyText", "Apply Now -- Become an LLM Engineer");

  await upsert("bootcamp", "enterprise", "title", "For Companies / Enterprise Programs");
  await upsert("bootcamp", "enterprise", "description", "BootcampAI also partners with organizations looking to upskill their teams or build AI capabilities from within. We offer customized enterprise AI programs that integrate with your company's strategy.");
  await upsert("bootcamp", "enterprise", "benefits", [
    "Tailored AI training and workforce upskilling programs.",
    "Dedicated mentorship from BootcampAI experts.",
    "Collaboration opportunities through our European partnerships.",
    "Access to pre-trained AI talents for future hiring needs.",
  ]);
  await upsert("bootcamp", "enterprise", "cta", "Empower your organization with BootcampAI's innovation-driven training.");
  await upsert("bootcamp", "enterprise", "email", "mahmood.salah@email.com");

  await upsert("mentorship", "hero", "title", "I haven't met you, and this is exciting...");
  await upsert("mentorship", "hero", "subtitle", "But if you need an AI mentor, let's connect. Whether you're learning your first model or deploying production AI systems, I can help.");

  await upsert("mentorship", "intro", "title", "Being an AI learner is tough.");
  await upsert("mentorship", "intro", "description", "It seems like every week there's a new model, framework, or research breakthrough to keep up with. Honestly, it can be overwhelming and intimidating. I know because I've been there. So whether you're new to AI or looking for expert guidance on your next project, I can help.");

  await upsert("mentorship", "plans", "title", "Mentorship Plans");
  await upsert("mentorship", "plans", "subtitle", "Choose the plan that fits your needs. Every plan includes personalized, one-on-one guidance tailored to your goals.");
  await upsert("mentorship", "plans", "items", [
    { title: "Course Learning Support", price: "$25", originalPrice: "$75", duration: "1 month", description: "Focused guidance on AI courses and learning paths. Get unstuck, understand concepts deeply, and accelerate your AI learning journey.", bestFor: "AI learners at any level", features: ["Unlimited chat support", "2 hours of 1:1 mentoring", "Course material review and explanation", "Study plan recommendations"], cta: "Get Started", href: "mailto:mahmood.salah@email.com?subject=Course%20Learning%20Support", icon: "BookOpen", discount: "67% OFF" },
    { title: "Personal Project Mentorship", price: "$150", originalPrice: "$500", duration: "2 months", description: "Hands-on collaboration to bring your AI project to life. Get expert feedback, code reviews, and architecture guidance for your personal AI projects.", bestFor: "Aspiring AI engineers", features: ["Unlimited chat support", "10 hours of 1:1 mentoring", "Project architecture review", "Code review and best practices", "Model selection and optimization", "Deployment strategy guidance"], cta: "Start Your Project", href: "mailto:mahmood.salah@email.com?subject=Personal%20Project%20Mentorship", icon: "Code", popular: true, discount: "70% OFF" },
    { title: "Company Project Consulting", price: "$1,200", duration: "3-4 months", description: "Strategic AI consulting for your organization. From feasibility studies to production deployment, get expert guidance on integrating AI into your business.", bestFor: "Teams & organizations", features: ["AI feasibility assessment", "Technical architecture planning", "Team training and upskilling", "Production deployment support"], cta: "Get Started", href: "mailto:mahmood.salah@email.com?subject=Company%20Project%20Consulting", icon: "Building2" },
  ]);

  await upsert("mentorship", "benefits", "title", "Benefits of Mentorship");
  await upsert("mentorship", "benefits", "subtitle", "I know a thing or two because I've done a thing or two in my AI career, and I'm committed to helping you make use of that knowledge.");
  await upsert("mentorship", "benefits", "items", [
    { title: "Tools & Frameworks", desc: "I'll help you build confidence and skill in AI tools like TensorFlow, PyTorch, LangChain, and more.", icon: "Wrench" },
    { title: "Resources", desc: "I'll point you towards the best courses, papers, and content to accelerate your learning.", icon: "BookMarked" },
    { title: "Networking", desc: "I'll connect you with other AI professionals and expand your reach in the industry.", icon: "Network" },
    { title: "Opportunity", desc: "I'll make introductions and help you find AI roles, projects, and collaboration opportunities.", icon: "Sparkles" },
    { title: "Growth", desc: "I'll uncover blind spots and accelerate your growth as an AI engineer.", icon: "TrendingUp" },
  ]);

  await upsert("mentorship", "mentoringStyle", "title", "My Mentoring Style");
  await upsert("mentorship", "mentoringStyle", "subtitle", "I strive to function as a catalyst and challenge you to grow as both an AI practitioner and a professional. I care about the details and will encourage you to think, plan, and dream.");
  await upsert("mentorship", "mentoringStyle", "items", [
    { title: "Authenticity", desc: "No sugar-coated feedback. I care about your growth too much to not keep it real. We'll work through challenges and build better solutions, together.", icon: "Heart" },
    { title: "Humility", desc: "AI is a rapidly evolving field. I don't claim to know everything, but I bring years of hands-on experience and a commitment to continuous learning.", icon: "Shield" },
    { title: "Equality", desc: "To me, you're more than just a mentee. You're a fellow AI practitioner. I'm not the only one teaching and you're not the only one learning.", icon: "Users" },
    { title: "Transparency", desc: "I don't have all the answers, but I'm happy to share what I've learned from building real-world AI systems and guide you to useful resources.", icon: "Eye" },
  ]);

  await upsert("mentorship", "bottomCta", "title", "Book a Consult");
  await upsert("mentorship", "bottomCta", "subtitle", "Thinking about mentorship? Let's talk about it. The first call is on me.");
  await upsert("mentorship", "bottomCta", "email", "mahmood.salah@email.com");

  await upsert("global", "settings", "email", "mahmood.salah@email.com");

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
