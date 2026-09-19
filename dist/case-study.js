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
        contribution: "The public corporate website for RAKwireless, presenting its products, solutions, and company information. Developed Laravel and Tailwind CSS features, delivered through a custom GitOps-style pipeline with GitHub webhooks, container-based deployments, and Mattermost status notifications.",
        stack: ["Laravel", "Tailwind CSS", "GitHub Webhooks", "Containers", "Mattermost"],
        destination: "aHR0cHM6Ly93d3cucmFrd2lyZWxlc3MuY29tL2VuLXVz",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://www.rakwireless.com/en-us",
      },
      {
        name: "RAKwireless Documentation Center",
        contribution: "A public knowledge base for RAKwireless hardware, software, and developer documentation. Built on the open-source Docusaurus documentation platform, with extensive custom theme development to meet the company's branding, product, and documentation requirements. Releases run through an internal GitLab CI/CD workflow that builds the site statically and publishes it to Amazon S3.",
        stack: ["Static Sites", "GitLab CI/CD", "GitLab Runners", "Amazon S3"],
        destination: "aHR0cHM6Ly9kb2NzLnJha3dpcmVsZXNzLmNvbS8",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://docs.rakwireless.com/",
      },
      {
        name: "RAKwireless Downloads Center",
        contribution: "A self-service portal where customers access firmware, software, manuals, and other product resources. Built the single-page application with Amazon S3 integration and a Nextcloud-connected file-management workflow for the technical team.",
        stack: ["Single-page App", "Amazon S3", "Nextcloud", "File Operations"],
        destination: "aHR0cHM6Ly9kb3dubG9hZHMucmFrd2lyZWxlc3MuY29tLw",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://downloads.rakwireless.com/",
      },
      {
        name: "RAKwireless Print Docs",
        contribution: "An internal publishing tool that turns Documentation Center pages into printable PDF editions. Built the Node.js application and its custom renderer, transforming Markdown templates into complete PDF documents on a recurring schedule.",
        stack: ["Node.js", "Markdown", "Custom PDF Renderer", "Automation"],
        destination: "aHR0cHM6Ly9wcmludC1kb2NzLnJha3dpcmVsZXNzLmNvbS8",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://print-docs.rakwireless.com/",
      },
      {
        name: "RAKwireless News Hub",
        contribution: "The company's editorial and news platform for IoT, LoRaWAN, and Web3 updates. Developed the Ghost theme to support the brand's publishing experience.",
        stack: ["Ghost", "Theme Development", "Content Publishing"],
        destination: "aHR0cHM6Ly9uZXdzLnJha3dpcmVsZXNzLmNvbS8",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://news.rakwireless.com/",
      },
      {
        name: "RAKwireless Store",
        contribution: "The company's e-commerce storefront for RAKwireless products. Developed Shopify theme features and custom integration tooling using Shopify APIs and custom apps. Integrated the store with Odoo for inventory tracking and warehouse order-fulfillment visibility. Configured webhook-driven post-order automations to flag incompatible device combinations, confirm antenna orders that may not suit the destination country, and verify requests for custom logo engraving before fulfillment.",
        stack: ["Shopify", "Theme Development", "Shopify APIs", "Custom Apps"],
        destination: "aHR0cHM6Ly9zdG9yZS5yYWt3aXJlbGVzcy5jb20v",
        image: "https://image.thum.io/get/width/1200/crop/800/noanimate/https://store.rakwireless.com/",
      },
      {
        name: "RAKwireless Learn",
        contribution: "A Zendesk-based learning and support experience for RAKwireless users. Developed its theme and configured automations and triggers that support broader customer-support workflows.",
        stack: ["Zendesk", "Theme Development", "Automations", "Triggers"],
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
    preview.href = `/external?dest=${project.destination}&source=portfolio`;
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
    visit.href = `/external?dest=${project.destination}&source=portfolio`;
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
