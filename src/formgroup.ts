interface RegexObject {
  [key: string]: RegExp;
}

abstract class Validator {
  constructor() {}
  /**
   * @param  {number} length
   * @returns RegexObject
   */
  public static minLength(length: number): RegexObject {
    return {
      minLength: new RegExp(`^{${length},}$`, "g"),
    };
  }
  /**
   * @param  {number} length
   * @returns RegexObject
   */
  public static maxLength(length: number): RegexObject {
    return {
      maxLength: new RegExp(`^{,${length}}$`, "g"),
    };
  }
  /**
   * @returns RegexObject
   */
  public static get personName(): RegexObject {
    return {
      personName: /^[A-ZÄÖÜ]([A-Za-zÄÖÜäöüß]+(\-| )?)*[a-zäöüß]$/,
    };
  }
  /**
   * @returns RegexObject
   */
  public static get email(): RegexObject {
    return {
      email: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
    };
  }
  /**
   * @returns RegexObject
   */
  public static get phonenumber(): RegexObject {
    return {
      phonenumber: /^\+[1-9]{1}[0-9]{3,14}$/,
    };
  }
  /**
   * @returns RegexObject
   */
  public static get iban(): RegexObject {
    return {
      iban: /^(?:(?:IT|SM)\d{2}[A-Z]\d{22}|CY\d{2}[A-Z]\d{23}|NL\d{2}[A-Z]{4}\d{10}|LV\d{2}[A-Z]{4}\d{13}|(?:BG|BH|GB|IE)\d{2}[A-Z]{4}\d{14}|GI\d{2}[A-Z]{4}\d{15}|RO\d{2}[A-Z]{4}\d{16}|KW\d{2}[A-Z]{4}\d{22}|MT\d{2}[A-Z]{4}\d{23}|NO\d{13}|(?:DK|FI|GL|FO)\d{16}|MK\d{17}|(?:AT|EE|KZ|LU|XK)\d{18}|(?:BA|HR|LI|CH|CR)\d{19}|(?:GE|DE|LT|ME|RS)\d{20}|IL\d{21}|(?:AD|CZ|ES|MD|SA)\d{22}|PT\d{23}|(?:BE|IS)\d{24}|(?:FR|MR|MC)\d{25}|(?:AL|DO|LB|PL)\d{26}|(?:AZ|HU)\d{27}|(?:GR|MU)\d{28})$/i,
    };
  }
  /**
   * @returns RegexObject
   */
  public static get street(): RegexObject {
    return {
      street: /^[A-ZÄÖÜ]([A-Za-zÄÖÜäöüß]+(\-| )?)*[a-zäöüß]$/,
    };
  }
  /**
   * @returns RegexObject
   */
  public static get streetnumber(): RegexObject {
    return {
      streetnumber: /^[0-9]+[a-zäöü]?$/,
    };
  }
  /**
   * @returns RegexObject
   */
  public static get postcode(): RegexObject {
    return {
      postcode: /^[0-9]{5}$/,
    };
  }
  /**
   * @returns RegexObject
   */
  public static get city(): RegexObject {
    return {
      city: /^[A-ZÄÖÜ]([A-Za-zÄÖÜäöüß]+(\-| )?)*[a-zäöüß]$/,
    };
  }
  /**
   * @returns RegexObject
   */
  public static get password(): RegexObject {
    return {
      password: /^(?=.*\d)(?=.*[a-zäöüß])(?=.*[A-ZÄÖÜ])[\da-zA-ZÄÖÜäöüß!$%&/\\(){}[\]=?*+~#\-_.:,;^°@]{8,}$/,
    };
  }
}

type supportedElementTypes =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

class FormControl {
  private _name: string;
  private _regexObject: { [key: string]: RegExp } = {};
  private _HTMLElementTag: string = "input";
  private _element: supportedElementTypes;
  private _value!: string;
  private _valid: boolean = true;

  /**
   * @param  {string} name
   * @param  {{} | {}[]} validators optional. Pass in a Validator (e.g.: Validator.email)
   * @param  {string} HTMLElementTag optional. Supported tags: input | textarea | select
   * @description Handles the state of the HTMLElement. Adds CSS classes for visual feedback (invalid: .invalid, valid: .valid)
   */
  constructor(
    name: string,
    validators?: RegexObject | RegexObject[],
    HTMLElementTag?: string
  ) {
    this._name = name;
    if (validators) {
      if (Array.isArray(validators))
        validators.forEach(
          (validator) =>
            (this._regexObject = Object.assign(this._regexObject, validator))
        );
      else this._regexObject = validators;
    }
    if (HTMLElementTag) this._HTMLElementTag = HTMLElementTag;
    this._element = this.getHTMLElementForSettingType();
  }
  /**
   * @returns supportedElementTypes
   */
  protected getHTMLElementForSettingType(): supportedElementTypes {
    switch (this._HTMLElementTag) {
      case "textarea":
        return (this._element = document.createElement("textarea"));
      case "select":
        return (this._element = document.createElement("select"));
      default:
        return (this._element = document.createElement("input"));
    }
  }
  /**
   * @returns void
   */
  protected addListeners(): void {
    this._element.addEventListener("keyup", (e) => {
      const target = e.target as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement;
      this._value = target.value;
      this.udpateValueAndValidity();
    });
  }
  /**
   * @returns void
   */
  protected updateDOMElement(): void {
    if (this._valid) {
      if (this._element.classList.contains("invalid"))
        this._element.classList.remove("invalid");
      this._element.classList.add("valid");
    } else {
      if (this._element.classList.contains("valid"))
        this._element.classList.remove("valid");
      this._element.classList.add("invalid");
    }
  }
  /**
   * @returns void
   */
  public udpateValueAndValidity(): void {
    const regexes = Object.entries(this._regexObject).map(
      (entry) => entry[1] as RegExp
    );
    regexes.forEach((regex) => {
      this._valid = regex.test(this._value);
    });
    this.updateDOMElement();
  }
  /**
   * @returns string
   */
  public get name(): string {
    return this._name;
  }
  /**
   * @returns string
   */
  public get HTMLElementTag(): string {
    return this._HTMLElementTag;
  }
  /**
   * @param  {supportedElementTypes} element
   */
  public set _DOMElement(element: supportedElementTypes) {
    this._element = element;
    this.addListeners();
  }
}

interface controls {
  [key: string]: FormControl;
}

class FormGroup {
  protected supportedElementTags = ["input", "textarea", "select"];

  private _controls: controls;
  /**
   * @param  {controls} controls
   */
  constructor(controls: controls) {
    this._controls = controls;

    this.validateFormControls();
  }
  /**
   * @returns void
   */
  protected validateFormControls(): void {
    let element: HTMLElement;
    let tag: string;
    this.FormControls.forEach((control) => {
      tag = control.HTMLElementTag;
      if (!this.supportedElementTags.includes(tag))
        throw "Unsupported HTMLElement!";

      element = document.querySelector(
        `${tag}[formControlName="${control.name}"]`
      ) as HTMLElement;
      if (!element)
        throw `Couldn't find HTMLElement with FormControl "${control.name}"`;
      control._DOMElement = element as any;
    });
  }
  /**
   * @returns FormControl
   */
  public get FormControls(): FormControl[] {
    return Object.entries(this._controls).map(
      (entry) => (entry[1] as unknown) as FormControl
    );
  }
}
