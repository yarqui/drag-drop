// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

type ProjType = "active" | "finished";

function validate(input: Validatable) {
  let isValid = true;

  if (input.required) {
    isValid = isValid && !!input.value.toString().trim().length;
  }
  if (input.minLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.trim().length >= input.minLength;
  }
  if (input.maxLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.trim().length <= input.maxLength;
  }
  if (input.min != null && typeof input.value === "number") {
    isValid = isValid && input.value >= input.min;
  }
  if (input.max != null && typeof input.value === "number") {
    isValid = isValid && input.value <= input.max;
  }

  return isValid;
}

// Autobind decorator
function Autobind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    },
  };
  return adjDescriptor;
}

// ProjectInput class
class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  formEl: HTMLFormElement;
  titleInputEl: HTMLInputElement;
  descInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

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
    this.formEl.id = "user-input";

    this.titleInputEl = this.formEl.querySelector("#title") as HTMLInputElement;
    this.descInputEl = this.formEl.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEl = this.formEl.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const title: string = this.titleInputEl.value;
    const description: string = this.descInputEl.value;
    const people: number = Number(this.peopleInputEl.value);

    const titleValidatable: Validatable = {
      value: title,
      required: true,
      minLength: 3,
      maxLength: 25,
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 3,
      maxLength: 400,
    };
    const peopleValidatable: Validatable = {
      value: people,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input. Please try again");
      return;
    }

    return [title, description, people];
  }

  @Autobind
  private submitHandler(e: Event): void {
    e.preventDefault();

    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      console.log("userInput:", userInput);
      // const [title, description, people] = userInput;
      this.formEl.reset();
    }
  }

  private configure(): void {
    this.formEl.addEventListener("submit", this.submitHandler);
  }

  private attach(): void {
    this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
  }
}

// ProjectList class
class ProjectList {
  templateListEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  sectionEl: HTMLElement;

  constructor(private type: ProjType) {
    this.templateListEl = document.querySelector(
      "#project-list"
    ) as HTMLTemplateElement;
    this.hostEl = document.querySelector("#app") as HTMLDivElement;

    const importedHTMLContent = document.importNode(
      this.templateListEl.content,
      true
    );

    this.sectionEl = importedHTMLContent.firstElementChild as HTMLElement;
    this.sectionEl.id = `${this.type}-projects`;

    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.sectionEl.querySelector("ul")!.id = listId;
    this.sectionEl.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private attach(): void {
    this.hostEl.insertAdjacentElement("beforeend", this.sectionEl);
  }
}

const projInput = new ProjectInput();
const activeProjList = new ProjectList("active");
const finishedProjList = new ProjectList("finished");
