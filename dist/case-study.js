const caseStudies = {
  wend: {
    company: "Wend Philippines Inc.", period: "2023 - Present", role: "Senior Full-Stack Web Developer / Technical Lead",
    project: "EHR and Occupational Wellness Management Platform",
    intro: "Leading the delivery of secure EHR and occupational-wellness software for clinical and insurance-provider workflows.",
    description: "A comprehensive electronic health record platform that brings occupational medical data, wellness metrics, research insights, and compliance workflows together for more informed health management.",
    highlights: ["Serves as technical lead and senior developer, guiding the team and moving delivery forward.", "Contributes core application code while managing deployment automation and production error tracing.", "Helps protect sensitive health data through HIPAA-aligned standards, protocols, and security reviews."],
    technologies: ["Laravel", "Flight PHP", "Svelte", "React", "jQuery", "AWS", "Docker", "Proxmox", "MySQL", "Database Normalization", "Database Sharding", "HIPAA", "VPN", "Firewall Management", "Web Security", "Penetration Testing"], screenshots: [],
    projects: [
      {
        name: "EHR and Occupational Wellness Platform",
        contribution: "An internal EHR and occupational-wellness platform that combines medical records, insurance-provider workflows, wellness metrics, research insights, and compliance support. As technical lead and senior developer, I drive delivery, contribute core code, guide the development team, and manage deployment automation, error tracing, and HIPAA-aligned data safeguards. The visuals shown are privacy-safe and contain no patient data.",
        stack: ["EHR", "Laravel", "React", "AWS", "HIPAA-aligned Security", "CI/CD"],
        destination: "aHR0cHM6Ly9vc2h3c29sdXRpb25zLmNvbS8",
        visitLabel: "Visit organization website",
        images: [
          { src: "/assets/wend-ehr/ipad-landscape.png", alt: "EHR platform interface displayed on a tablet", caption: "EHR platform" },
          { src: "/assets/wend-ehr/ehr-software.png", alt: "EHR software dashboard", caption: "EHR software" },
          { src: "/assets/wend-ehr/total-wellness-metrics.png", alt: "Total Wellness Metrics dashboard", caption: "Total Wellness Metrics" },
        ],
      },
    ],
  },
  rakwireless: {
    company: "RAKwireless Technology Ltd.", period: "2018 - 2023", role: "Web Development, DevOps, and IT Leadership",
    project: "Digital platform, content, and commerce ecosystem",
    intro: "Managed the engineering and operational work behind RAKwireless's public-facing and internal digital ecosystem.",
    description: "A connected portfolio of public web, commerce, documentation, downloads, publishing, and learning platforms—each with delivery automation designed for dependable releases.",
    highlights: ["Contributed development across RAKwireless's main public web, commerce, documentation, download, news, and learning platforms.", "Built and supported automated delivery paths, from container-based GitOps deployments to static-site publishing on S3.", "Connected product experiences with practical operational workflows, release visibility, and stakeholder notifications."],
    technologies: ["Laravel", "Tailwind CSS", "React", "Node.js", "Flight PHP", "Shopify Development", "Shopify APIs", "Custom Apps", "AWS Serverless", "Amazon S3", "DevSecOps", "Ansible", "Proxmox", "FinOps", "Odoo", "GitHub Webhooks", "GitLab CI/CD", "GitLab Runners", "Containers", "Mattermost", "Static Sites", "Single-Page Applications", "Nextcloud", "File Operations", "Markdown", "Custom PDF Renderer", "Automation", "Ghost", "Theme Development", "Content Publishing", "Zendesk", "Automations", "Triggers"], screenshots: [],
    projects: [
      {
        name: "RAKwireless Corporate Website",
        contribution: "The public corporate website for RAKwireless, presenting its products, solutions, and company information. Developed Laravel and Tailwind CSS features, delivered through a custom GitOps-style pipeline with GitHub webhooks, container-based deployments, and Mattermost status notifications.",
        stack: ["Laravel", "Tailwind CSS", "GitHub Webhooks", "Containers", "Mattermost"],
        destination: "aHR0cHM6Ly93d3cucmFrd2lyZWxlc3MuY29tL2VuLXVz",
        image: "/assets/rakwireless/corporate-website.png",
      },
      {
        name: "RAKwireless Documentation Center",
        contribution: "A public knowledge base for RAKwireless hardware, software, and developer documentation. Built on the open-source Docusaurus documentation platform, with extensive custom theme development to meet the company's branding, product, and documentation requirements. Releases run through an internal GitLab CI/CD workflow that builds the site statically and publishes it to Amazon S3.",
        stack: ["Static Sites", "GitLab CI/CD", "GitLab Runners", "Amazon S3"],
        destination: "aHR0cHM6Ly9kb2NzLnJha3dpcmVsZXNzLmNvbS8",
        image: "/assets/rakwireless/documentation-center.png",
      },
      {
        name: "RAKwireless Downloads Center",
        contribution: "A self-service portal where customers access firmware, software, manuals, and other product resources. Built the single-page application with Amazon S3 integration and a Nextcloud-connected file-management workflow for the technical team.",
        stack: ["Single-page App", "Amazon S3", "Nextcloud", "File Operations"],
        destination: "aHR0cHM6Ly9kb3dubG9hZHMucmFrd2lyZWxlc3MuY29tLw",
        image: "/assets/rakwireless/downloads-center.png",
      },
      {
        name: "RAKwireless Print Docs",
        contribution: "An internal publishing tool that turns Documentation Center pages into printable PDF editions. Built the Node.js application and its custom renderer, transforming Markdown templates into complete PDF documents on a recurring schedule.",
        stack: ["Node.js", "Markdown", "Custom PDF Renderer", "Automation"],
        destination: "aHR0cHM6Ly9wcmludC1kb2NzLnJha3dpcmVsZXNzLmNvbS8",
        image: "/assets/rakwireless/print-docs.png",
      },
      {
        name: "RAKwireless News Hub",
        contribution: "The company's editorial and news platform for IoT, LoRaWAN, and Web3 updates. Developed the Ghost theme to support the brand's publishing experience.",
        stack: ["Ghost", "Theme Development", "Content Publishing"],
        destination: "aHR0cHM6Ly9uZXdzLnJha3dpcmVsZXNzLmNvbS8",
        image: "/assets/rakwireless/news-hub.png",
      },
      {
        name: "RAKwireless Store",
        contribution: "The company's e-commerce storefront for RAKwireless products. Developed Shopify theme features and custom integration tooling using Shopify APIs and custom apps. Integrated the store with Odoo for inventory tracking and warehouse order-fulfillment visibility. Configured webhook-driven post-order automations to flag incompatible device combinations, confirm antenna orders that may not suit the destination country, and verify requests for custom logo engraving before fulfillment.",
        stack: ["Shopify", "Theme Development", "Shopify APIs", "Custom Apps"],
        destination: "aHR0cHM6Ly9zdG9yZS5yYWt3aXJlbGVzcy5jb20v",
        image: "/assets/rakwireless/store.png",
      },
      {
        name: "RAKwireless Learn",
        contribution: "A Zendesk-based learning and support experience for RAKwireless users. Developed its theme and configured automations and triggers that support broader customer-support workflows.",
        stack: ["Zendesk", "Theme Development", "Automations", "Triggers"],
        destination: "aHR0cHM6Ly9sZWFybi5yYWt3aXJlbGVzcy5jb20v",
        image: "/assets/rakwireless/learn.png",
      },
    ],
  },
};

const requestedCompany = window.location.pathname.match(/^\/case-study\/(wend|rakwireless)\/?$/)?.[1];
const study = caseStudies[requestedCompany] || caseStudies.wend;

document.title = `${study.company} Case Study - Phoenix Eve Aspacio`;
document.querySelector('#case-period').textContent = study.period;
document.querySelector('#case-title').textContent = study.company;
document.querySelector('#case-role').textContent = study.role;
document.querySelector('#case-intro').textContent = study.intro;
document.querySelector('#case-project').textContent = study.project;
document.querySelector('#case-description').textContent = study.description;

if (study.projects?.length === 1) {
  const visualsTitle = document.querySelector('#visuals-title');
  visualsTitle.replaceChildren('Selected', document.createElement('br'), 'project.');
}

const highlights = document.querySelector('#case-highlights');
study.highlights.forEach((highlight) => {
  const item = document.createElement('li');
  item.textContent = highlight;
  highlights.append(item);
});

const technologies = document.querySelector('#case-technologies');
study.technologies.forEach((technology) => {
  const item = document.createElement('span');
  item.textContent = technology;
  technologies.append(item);
});

const gallery = document.querySelector('#case-gallery');
if (study.projects?.length) {
  if (study.projects.length === 1) gallery.classList.add('case-gallery-single');

  study.projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'case-project-card';

    const hasImageCarousel = project.images?.length;
    let preview;
    if (hasImageCarousel) {
      preview = document.createElement('section');
      preview.className = 'case-project-carousel';
      preview.setAttribute('aria-label', `${project.name} screenshot gallery`);
      preview.setAttribute('role', 'region');
      const track = document.createElement('div');
      track.className = 'case-project-carousel-track';
      const slides = [];
      project.images.forEach((screenshot, screenshotIndex) => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const caption = document.createElement('figcaption');
        image.src = screenshot.src;
        image.alt = screenshot.alt;
        image.loading = screenshotIndex === 0 ? 'eager' : 'lazy';
        caption.textContent = screenshot.caption;
        figure.append(image, caption);
        track.append(figure);
        slides.push(figure);
      });
      const controls = document.createElement('div');
      controls.className = 'case-project-carousel-controls';
      const previous = document.createElement('button');
      previous.className = 'case-project-carousel-button';
      previous.type = 'button';
      previous.setAttribute('aria-label', 'Show previous screenshot');
      previous.textContent = '←';
      const status = document.createElement('p');
      status.className = 'case-project-carousel-status';
      status.setAttribute('aria-live', 'polite');
      const next = document.createElement('button');
      next.className = 'case-project-carousel-button';
      next.type = 'button';
      next.setAttribute('aria-label', 'Show next screenshot');
      next.textContent = '→';
      controls.append(previous, status, next);
      preview.append(track, controls);

      let activeSlide = 0;
      let autoAdvance;
      const updateSlide = (nextIndex) => {
        activeSlide = (nextIndex + slides.length) % slides.length;
        track.style.transform = `translateX(-${activeSlide * 100}%)`;
        status.textContent = `${activeSlide + 1} / ${slides.length}`;
        slides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== activeSlide)));
      };
      const stopAutoAdvance = () => window.clearInterval(autoAdvance);
      const startAutoAdvance = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        stopAutoAdvance();
        autoAdvance = window.setInterval(() => updateSlide(activeSlide + 1), 6000);
      };
      previous.addEventListener('click', () => {
        updateSlide(activeSlide - 1);
        startAutoAdvance();
      });
      next.addEventListener('click', () => {
        updateSlide(activeSlide + 1);
        startAutoAdvance();
      });
      preview.addEventListener('mouseenter', stopAutoAdvance);
      preview.addEventListener('mouseleave', startAutoAdvance);
      preview.addEventListener('focusin', stopAutoAdvance);
      preview.addEventListener('focusout', (event) => {
        if (!preview.contains(event.relatedTarget)) startAutoAdvance();
      });
      updateSlide(0);
      startAutoAdvance();
    } else {
      preview = document.createElement('a');
      preview.className = 'case-project-preview';
      preview.href = `/external?dest=${project.destination}&source=portfolio`;
      preview.target = '_blank';
      preview.rel = 'noreferrer';
      preview.setAttribute('aria-label', `Visit ${project.name}`);

      const image = document.createElement('img');
      image.src = project.image;
      image.alt = `${project.name} website preview`;
      image.loading = index < 2 ? 'eager' : 'lazy';
      preview.append(image);
    }

    const details = document.createElement('div');
    details.className = 'case-project-details';
    const number = document.createElement('p');
    number.className = 'case-project-number';
    number.textContent = `PROJECT ${String(index + 1).padStart(2, '0')}`;
    const title = document.createElement('h3');
    title.textContent = project.name;
    const contribution = document.createElement('p');
    contribution.textContent = project.contribution;
    const stack = document.createElement('div');
    stack.className = 'case-project-stack';
    project.stack.forEach((technology) => {
      const tag = document.createElement('span');
      tag.textContent = technology;
      stack.append(tag);
    });
    const visit = document.createElement('a');
    visit.className = 'case-project-link';
    visit.href = `/external?dest=${project.destination}&source=portfolio`;
    visit.target = '_blank';
    visit.rel = 'noreferrer';
    visit.textContent = project.visitLabel || 'Visit live site ↗';
    details.append(number, title, contribution, stack);
    details.append(visit);
    card.append(preview, details);
    gallery.append(card);
  });
} else if (study.screenshots.length === 0) {
  const placeholder = document.createElement('p');
  placeholder.className = 'case-gallery-empty';
  placeholder.textContent = 'Project visuals will be added here.';
  gallery.append(placeholder);
} else {
  study.screenshots.forEach((screenshot) => {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    const caption = document.createElement('figcaption');
    image.src = screenshot.src;
    image.alt = screenshot.alt;
    image.loading = 'lazy';
    caption.textContent = screenshot.caption;
    figure.append(image, caption);
    gallery.append(figure);
  });
}
