import { useState } from "react";
import { Menu, X, ArrowRight, CheckCircle, Shield, Code, Server, ChevronDown, Instagram, Linkedin, Twitter } from "lucide-react";

export default function ZansphereWebsite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const services = [
    {
      title: "Software Development",
      description: "Custom software solutions tailored to your business needs with modern frameworks and technologies.",
      icon: <Code className="h-10 w-10 text-indigo-600" />,
      category: "dev"
    },
    {
      title: "Quality Assurance",
      description: "Comprehensive testing methodologies to ensure your software meets the highest quality standards.",
      icon: <CheckCircle className="h-10 w-10 text-indigo-600" />,
      category: "qa"
    },
    {
      title: "DevOps",
      description: "Streamline your development and operations with our expert DevOps services and CI/CD pipelines.",
      icon: <Server className="h-10 w-10 text-indigo-600" />,
      category: "devops"
    },
    {
      title: "Security Testing",
      description: "Protect your applications from vulnerabilities with our thorough security assessment services.",
      icon: <Shield className="h-10 w-10 text-indigo-600" />,
      category: "security"
    }
  ];

  const projects = [
    {
      name: "ShariaStocks.in",
      description: "AI-powered platform for identifying halal (Sharia-compliant) stocks with real-time screening and personalized watchlists.",
      image: "/api/placeholder/600/400",
      tags: ["AI", "FinTech", "Web Platform"]
    },
    {
      name: "Enterprise Resource Planning",
      description: "Comprehensive ERP solution for manufacturing clients with inventory management and supply chain optimization.",
      image: "/api/placeholder/600/400",
      tags: ["ERP", "Manufacturing", "Cloud"]
    },
    {
      name: "Security Compliance Tool",
      description: "Automated compliance checking tool for financial institutions to maintain regulatory standards.",
      image: "/api/placeholder/600/400",
      tags: ["Security", "Finance", "Compliance"]
    }
  ];

  const filteredServices = activeTab === "all" 
    ? services 
    : services.filter(service => service.category === activeTab);

  return (
    <div className="bg-white">
      {/* Navigation */}
      <header className="fixed w-full bg-white shadow-sm z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-indigo-600">Zansphere</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#services" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
              Services
            </a>
            <a href="#about" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
              About
            </a>
            <a href="#projects" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
              Projects
            </a>
            <a href="#team" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
              Team
            </a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#contact" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Contact Us
            </a>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="text-2xl font-bold text-indigo-600">Zansphere</span>
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <a
                      href="#services"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Services
                    </a>
                    <a
                      href="#about"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About
                    </a>
                    <a
                      href="#projects"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Projects
                    </a>
                    <a
                      href="#team"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Team
                    </a>
                  </div>
                  <div className="py-6">
                    <a
                      href="#contact"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative pt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-32">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Building Tomorrow's <span className="text-indigo-600">Technology</span> Today
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Zansphere delivers cutting-edge software development, quality assurance, DevOps, and security testing services to help your business thrive in the digital age.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="#services"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Explore Services
                  </a>
                  <a href="#about" className="text-sm font-semibold leading-6 text-gray-900">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">About Us</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Chennai's Premier Software Technology Company
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Established on October 23, 2024, Zansphere Private Limited is a self-owned private company registered under the Ministry of Corporate Affairs in India. We are dedicated to delivering high-quality software solutions that are both functional and secure.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </div>
                    Innovative Solutions
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    We leverage cutting-edge technologies to create innovative solutions that address complex business challenges.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    Expert Team
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Our team of skilled professionals brings expertise across multiple domains to deliver exceptional results.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                      </svg>
                    </div>
                    Data-Driven Approach
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    We utilize data analytics to inform our decisions and optimize solutions for maximum efficiency.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </div>
                    Continuous Improvement
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    We are committed to continuous learning and improvement, staying ahead of industry trends to deliver the best solutions.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div id="services" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Services</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Comprehensive Technology Solutions
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                We offer a wide range of services to help your business succeed in the digital landscape.
              </p>
            </div>

            <div className="mt-10 flex justify-center space-x-2">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-md ${activeTab === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab("dev")}
                className={`px-4 py-2 rounded-md ${activeTab === "dev" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Development
              </button>
              <button 
                onClick={() => setActiveTab("qa")}
                className={`px-4 py-2 rounded-md ${activeTab === "qa" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                QA
              </button>
              <button 
                onClick={() => setActiveTab("devops")}
                className={`px-4 py-2 rounded-md ${activeTab === "devops" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                DevOps
              </button>
              <button 
                onClick={() => setActiveTab("security")}
                className={`px-4 py-2 rounded-md ${activeTab === "security" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Security
              </button>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
                {filteredServices.map((service, index) => (
                  <div key={index} className="rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="mb-6">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                    <p className="mt-4 text-base text-gray-600">{service.description}</p>
                    <div className="mt-6">
                      <a href="#contact" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center">
                        Learn more <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div id="projects" className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Our Work</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Featured Projects
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Explore some of our notable projects that showcase our expertise and innovation.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {projects.map((project, index) => (
                <article key={index} className="flex flex-col items-start justify-between rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="relative w-full">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="aspect-[16/9] w-full rounded-lg bg-gray-100 object-cover sm:aspect-[2/1]"
                    />
                  </div>
                  <div className="max-w-xl mt-6">
                    <div className="flex items-center gap-x-4 text-xs">
                      {project.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="relative z-10 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <a href="#">{project.name}</a>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{project.description}</p>
                    </div>
                    <div className="mt-5">
                      <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center">
                        View case study <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div id="team" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Our Team</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Meet the Leadership
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our experienced leadership team brings years of industry expertise to every project.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="flex flex-col items-center">
                <img className="aspect-square w-48 rounded-full object-cover" src="/api/placeholder/300/300" alt="Nasreen Fathima" />
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">Nasreen Fathima</h3>
                <p className="text-base leading-7 text-indigo-600">Co-Founder & Director</p>
                <p className="mt-4 text-center text-base leading-7 text-gray-600">
                  Brings extensive expertise in software development and project management to lead innovative technology solutions.
                </p>
                <div className="mt-4 flex gap-x-6">
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <img className="aspect-square w-48 rounded-full object-cover" src="/api/placeholder/300/300" alt="Muhammed Zubair" />
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">Muhammed Zubair</h3>
                <p className="text-base leading-7 text-indigo-600">Co-Founder & Director</p>
                <p className="mt-4 text-center text-base leading-7 text-gray-600">
                  Expert in security testing and DevOps practices with a passion for building secure, scalable software solutions.
                </p>
                <div className="mt-4 flex gap-x-6">
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <GitHub className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Testimonials</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                What Our Clients Say
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col justify-between rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                <div>
                  <div className="flex items-center gap-x-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="mt-6">
                    <p className="text-lg font-semibold text-gray-900">Exceptional security implementation</p>
                    <p className="mt-4 text-gray-600">
                      "Zansphere's security testing team identified vulnerabilities that our previous audits missed. Their remediation strategies were practical and effective, significantly improving our compliance posture."
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <img
                    src="/api/placeholder/40/40"
                    alt="Client"
                    className="h-10 w-10 rounded-full bg-gray-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Priya Sharma</p>
                    <p className="text-sm text-gray-600">CTO, TechSecure Solutions</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                <div>
                  <div className="flex items-center gap-x-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="mt-6">
                    <p className="text-lg font-semibold text-gray-900">Streamlined our DevOps pipeline</p>
                    <p className="mt-4 text-gray-600">
                      "The DevOps implementation by Zansphere reduced our deployment time by 70% and virtually eliminated deployment failures. Their team's expertise in CI/CD practices was invaluable."
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <img
                    src="/api/placeholder/40/40"
                    alt="Client"
                    className="h-10 w-10 rounded-full bg-gray-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Rajiv Mehta</p>
                    <p className="text-sm text-gray-600">Lead Developer, CloudSync Technologies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Contact Us</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Get in Touch
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Ready to transform your business with our technology solutions? Reach out to us today.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                      Phone
                    </label>
                    <div className="mt-2">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="+1 (555) 987-6543"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium leading-6 text-gray-900">
                      Service Interest
                    </label>
                    <div className="mt-2">
                      <select
                        id="service"
                        name="service"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option>Software Development</option>
                        <option>Quality Assurance</option>
                        <option>DevOps</option>
                        <option>Security Testing</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900">
                      Message
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Tell us about your project..."
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
              <div>
                <div className="rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">Contact Information</h3>
                  <dl className="mt-6 space-y-6">
                    <div className="flex gap-x-4">
                      <dt className="flex-none">
                        <span className="sr-only">Address</span>
                        <svg className="h-7 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                      </dt>
                      <dd className="text-base leading-7 text-gray-600">
                        38, Velmurugan Nagar, Kolathur<br />
                        Ambattur, Tiruvallur<br />
                        Tamil Nadu, India – 600099
                      </dd>
                    </div>
                    <div className="flex gap-x-4">
                      <dt className="flex-none">
                        <span className="sr-only">Telephone</span>
                        <svg className="h-7 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </dt>
                      <dd className="text-base leading-7 text-gray-600">
                        <a href="tel:+91-9876543210" className="hover:text-indigo-600">+91-9876543210</a>
                      </dd>
                    </div>
                    <div className="flex gap-x-4">
                      <dt className="flex-none">
                        <span className="sr-only">Email</span>
                        <svg className="h-7 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </dt>
                      <dd className="text-base leading-7 text-gray-600">
                        <a href="mailto:info@zansphere.com" className="hover:text-indigo-600">info@zansphere.com</a>
                      </dd>
                    </div>
                  </dl>
                  
                  <div className="mt-10">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">Follow Us</h3>
                    <div className="mt-4 flex space-x-6">
                      <a href="#" className="text-gray-500 hover:text-indigo-600">
                        <span className="sr-only">LinkedIn</span>
                        <Linkedin className="h-6 w-6" />
                      </a>
                      <a href="#" className="text-gray-500 hover:text-indigo-600">
                        <span className="sr-only">Twitter</span>
                        <Twitter className="h-6 w-6" />
                      </a>
                      <a href="#" className="text-gray-500 hover:text-indigo-600">
                        <span className="sr-only">GitHub</span>
                        <GitHub className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">Business Hours</h3>
                  <dl className="mt-6 space-y-1">
                    <div className="flex justify-between gap-x-4">
                      <dt className="text-base leading-7 text-gray-600">Monday - Friday</dt>
                      <dd className="text-base leading-7 font-medium">9:00 AM - 6:00 PM</dd>
                    </div>
                    <div className="flex justify-between gap-x-4">
                      <dt className="text-base leading-7 text-gray-600">Saturday</dt>
                      <dd className="text-base leading-7 font-medium">10:00 AM - 4:00 PM</dd>
                    </div>
                    <div className="flex justify-between gap-x-4">
                      <dt className="text-base leading-7 text-gray-600">Sunday</dt>
                      <dd className="text-base leading-7 font-medium">Closed</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <span className="text-2xl font-bold text-white">Zansphere</span>
              <p className="text-sm leading-6 text-gray-300">
                Building tomorrow's technology today, with expertise in software development, QA, DevOps, and security testing.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">GitHub</span>
                  <GitHub className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Services</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="#services" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Software Development
                      </a>
                    </li>
                    <li>
                      <a href="#services" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Quality Assurance
                      </a>
                    </li>
                    <li>
                      <a href="#services" className="text-sm leading-6 text-gray-300 hover:text-white">
                        DevOps
                      </a>
                    </li>
                    <li>
                      <a href="#services" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Security Testing
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="#about" className="text-sm leading-6 text-gray-300 hover:text-white">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#team" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Team
                      </a>
                    </li>
                    <li>
                      <a href="#projects" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Projects
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Careers
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Cookie Policy
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="#contact" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Contact
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Resources
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-gray-400">&copy; {new Date().getFullYear()} Zansphere Private Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}