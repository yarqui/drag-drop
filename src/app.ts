class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  formEl: HTMLFormElement;
  constructor() {
    this.templateEl = document.querySelector(
      "#project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.querySelector("#app")! as HTMLDivElement;

    const importedHTMLContent = document.importNode(
      this.templateEl.content,
      true
    );

    this.formEl = importedHTMLContent.firstElementChild as HTMLFormElement;
    this.attach();
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
  }
}

const projInput = new ProjectInput();
