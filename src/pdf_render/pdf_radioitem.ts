import { IQuestion } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class RadioGroupWrap {
    private _radioGroup: any;
    public constructor(private name: string, private controller: DocController, private readOnly: boolean = false) {
    }
    public addToPdf() {
        this._radioGroup = new this.controller.doc.AcroFormRadioButton();
        this._radioGroup.value = this.name;
        this._radioGroup.readOnly = this.readOnly;
        this._radioGroup.color = SurveyHelper.FORM_BORDER_COLOR;
        this.controller.doc.addField(this._radioGroup);
    }
    get radioGroup() {
        return this._radioGroup;
    }
}

export class RadioItemBrick extends PdfBrick {
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, private index: number, private checked: Boolean,
        private radioGroupWrap: RadioGroupWrap) {
        super(question, controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        if (this.index == 0) {
            this.radioGroupWrap.addToPdf();
        }
        let name = this.radioGroupWrap.radioGroup.value + 'index' + this.index;
        let radioButton = this.radioGroupWrap.radioGroup.createOption(name);
        radioButton.Rect = SurveyHelper.createAcroformRect(this);
        if (this.checked) {
            radioButton.AS = '/' + name;
        }
        let formScale = SurveyHelper.formScale(this.controller, this);
        radioButton.Rect = SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this, formScale));
        radioButton.color = SurveyHelper.FORM_BORDER_COLOR;
        SurveyHelper.renderFlatBorders(this.controller, this);
        this.radioGroupWrap.radioGroup.setAppearance(this.controller.doc.AcroForm.Appearance.RadioButton.Circle);
    }
}