const caseStudies = {
  wend: {
    company: "Wend Philippines Inc.", period: "2023 - Present", role: "Lead Full-Stack Web Developer / Technical Lead",
    project: "Patient and insurance-provider management systems",
    intro: "Leading the delivery of practical digital systems for patient information and insurance-provider workflows.",
    description: "Responsive applications, cloud deployments, and operational tooling designed to keep critical healthcare-adjacent workflows moving.",
    highlights: ["Shapes full-stack application delivery and technical direction.", "Connects responsive product experiences with dependable deployment workflows.", "Improves the operational details behind high-stakes information flows."],
    technologies: ["Laravel", "FlightPHP", "Svelte", "React", "jQuery", "AWS", "Docker", "Proxmox"], screenshots: [],
  },
  rakwireless: {
    company: "RAKwireless Technology Ltd.", period: "2018 - 2023", role: "Web Development, DevOps, and IT Leadership",
    project: "Digital platform, content, and commerce ecosystem",
    intro: "Progressed from rebuilding the public web presence to leading cross-functional IT delivery.",
    description: "A connected portfolio of public web, commerce, documentation, downloads, publishing, and learning platforms—each with delivery automation designed for dependable releases.",
    highlights: ["Contributed development across RAKwireless's main public web, commerce, documentation, download, news, and learning platforms.", "Built and supported automated delivery paths, from container-based GitOps deployments to static-site publishing on S3.", "Connected product experiences with practical operational workflows, release visibility, and stakeholder notifications."],
    technologies: ["Laravel", "React", "Node.js", "FlightPHP", "Shopify Development", "AWS Serverless", "DevSecOps", "Ansible", "Proxmox", "FinOps", "Odoo"], screenshots: [],
    projects: [
      {
        name: "RAKwireless Corporate Website",
        contribution: "Contributed Laravel and Tailwind development for the corporate web presence. Built into a custom GitOps-style delivery path: GitHub webhooks trigger an internal pipeline that builds and deploys containers, with Mattermost deployment-status notifications keeping stakeholders informed.",
        stack: ["Laravel", "Tailwind CSS", "GitHub Webhooks", "Containers", "Mattermost"],
        url: "https://www.rakwireless.com/en-us",
        destination: "aHR0cHM6Ly93d3cucmFrd2lyZWxlc3MuY29tL2VuLXVz",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://www.rakwireless.com/en-us",
      },
      {
        name: "RAKwireless Documentation Center",
        contribution: "Contributed development to the product documentation hub. Releases run through an internal GitLab CI/CD pipeline, building the documentation as a static site and publishing it to Amazon S3.",
        stack: ["Static Sites", "GitLab CI/CD", "GitLab Runners", "Amazon S3"],
        url: "https://docs.rakwireless.com/",
        destination: "aHR0cHM6Ly9kb2NzLnJha3dpcmVsZXNzLmNvbS8",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://docs.rakwireless.com/",
      },
      {
        name: "RAKwireless Downloads Center",
        contribution: "Developed a single-page Downloads Center integrated with Amazon S3. The technical team can manage releases through an S3-connected Nextcloud folder, making uploads and updates straightforward without changing the app.",
        stack: ["Single-page App", "Amazon S3", "Nextcloud", "File Operations"],
        url: "https://downloads.rakwireless.com/",
        destination: "aHR0cHM6Ly9kb3dubG9hZHMucmFrd2lyZWxlc3MuY29tLw",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://downloads.rakwireless.com/",
      },
      {
        name: "RAKwireless Print Docs",
        contribution: "Developed a Node.js application that periodically archives documentation pages as polished PDF editions. A custom renderer transforms Markdown templates into full PDF documents for offline and printable reference.",
        stack: ["Node.js", "Markdown", "Custom PDF Renderer", "Automation"],
        url: "https://print-docs.rakwireless.com/",
        destination: "aHR0cHM6Ly9wcmludC1kb2NzLnJha3dpcmVsZXNzLmNvbS8",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://print-docs.rakwireless.com/",
      },
      {
        name: "RAKwireless News Hub",
        contribution: "Contributed theme development for the RAKwireless News Hub, extending the Ghost publishing experience to support the brand's IoT, LoRaWAN, and Web3 editorial content.",
        stack: ["Ghost", "Theme Development", "Content Publishing"],
        url: "https://news.rakwireless.com/",
        destination: "aHR0cHM6Ly9uZXdzLnJha3dpcmVsZXNzLmNvbS8",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://news.rakwireless.com/",
      },
      {
        name: "RAKwireless Store",
        contribution: "Contributed Shopify theme development and custom integration tooling. The work includes Shopify Developer API and custom-app integrations that support a richer commerce workflow.",
        stack: ["Shopify", "Theme Development", "Shopify APIs", "Custom Apps"],
        url: "https://store.rakwireless.com/",
        destination: "aHR0cHM6Ly9zdG9yZS5yYWt3aXJlbGVzcy5jb20v",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://store.rakwireless.com/",
      },
      {
        name: "RAKwireless Learn",
        contribution: "Contributed theme development for the learning site inside Zendesk Support, alongside automations and triggers that help connect the support experience to the wider operational workflow.",
        stack: ["Zendesk", "Theme Development", "Automations", "Triggers"],
        url: "https://learn.rakwireless.com/",
        destination: "aHR0cHM6Ly9sZWFybi5yYWt3aXJlbGVzcy5jb20v",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://learn.rakwireless.com/",
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
  study.projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'case-project-card';

    const preview = document.createElement('a');
    preview.className = 'case-project-preview';
    preview.href = `/external?dest=${project.destination}`;
    preview.target = '_blank';
    preview.rel = 'noreferrer';
    preview.setAttribute('aria-label', `Visit ${project.name}`);

    const image = document.createElement('img');
    image.src = project.image;
    image.alt = `${project.name} website preview`;
    image.loading = index < 2 ? 'eager' : 'lazy';
    preview.append(image);

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
    visit.href = `/external?dest=${project.destination}`;
    visit.target = '_blank';
    visit.rel = 'noreferrer';
    visit.textContent = 'Visit live site ↗';
    details.append(number, title, contribution, stack, visit);
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
