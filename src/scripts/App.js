import AsciiFactory from './factories/AsciiFactory';
import CharacterSetFactory from './factories/CharacterSetFactory';
import ImageFactory from './factories/ImageFactory';
import CanvasService from './services/CanvasService';

export default class App {
    constructor(options) {
        this.image = undefined;

        this.inputFileElement = options.inputFileElement;
        this.inputFilePreviewElement = options.inputFilePreviewElement;
        this.inputCharacterSetElement = options.inputCharacterSetElement;
        this.inputSizeElement = options.inputSizeElement;
        this.inputLineHeightElement = options.inputLineHeightElement;
        this.characterSetRangeElement = options.characterSetRangeElement;
        this.btnPreset = options.btnPreset;
        this.btnStartElement = options.btnStartElement;
        this.outputElement = options.outputElement;
        this.exampleElements = options.exampleElements;

        this.addInputEventListeners();
        this.setCharacterSetFromPreset(this.getPresets().ascii);

        this.btnStartElement.addEventListener('click', () => {
            console.log("Generate");
            if (!this.isValid()) return;

            this.generateAscii(this.image)
            .then((ascii) => {
                window.document.getElementById("account-page").contentWindow.displayInRows(ascii);
                // this.outputElement.innerHTML = this.escapeHtml(ascii);
            });
        });
    }

    addInputEventListeners() {
        const previewImage = (image) => {
            this.inputFilePreviewElement.style.backgroundImage = 'url(' + image.src + ')';
            this.inputFilePreviewElement.parentNode.classList.add('file-uploader--preview');
            
        };
        const handleFile = (file) => {
            this.inputFileElement.parentNode.classList.remove('form__control--error');

            ImageFactory.getImageFromFile(file)
            .then((image) => {
                previewImage(image);
                this.image = image;
            })
            .catch((err) => {
                this.image = undefined;
            });
        };

        this.inputFileElement.addEventListener('change', () => {
            if (!this.inputFileElement.files.length) return;
            handleFile(this.inputFileElement.files[0]);
        });

        // Enable dropping files
        this.inputFileElement.parentNode.addEventListener('dragover', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.inputFileElement.parentNode.classList.add('file-uploader--highlight');
        });
        this.inputFileElement.parentNode.addEventListener('dragleave', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.inputFileElement.parentNode.classList.remove('file-uploader--highlight');
        });
        this.inputFileElement.parentNode.addEventListener('drop', (e) => {
            e.stopPropagation();
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
            this.inputFileElement.parentNode.classList.remove('file-uploader--highlight');
        });

        this.inputCharacterSetElement.addEventListener('change', () => {
            this.inputCharacterSetElement.classList.remove('form__control--error');
        });

        this.inputCharacterSetElement.addEventListener('change', () => {
            this.inputCharacterSetElement.classList.remove('form__control--error');
        });

        for (let charset in this.btnPreset) {
            this.btnPreset[charset].addEventListener('click', () => {
                let presets = this.getPresets();
                this.setCharacterSetFromPreset(presets[charset]);
                this.inputLineHeightElement.value = App.LINE_HEIGHT[charset];
            });
        }

        this.inputCharacterSetElement.addEventListener('change', () => this.selectCharacterSet());
        this.inputCharacterSetElement.addEventListener('keyup', () => this.selectCharacterSet());
        
        for (let el=0; el<this.exampleElements.length; el++) {
            if (this.exampleElements[el]) {
                console.log(el);
                console.log(this.exampleElements[el]);
                
                this.exampleElements[el].addEventListener('click', () => {
                    var img = this.exampleElements[el].children[0]
                    console.log(img.src);
                    previewImage(img);
                    this.image = img
                });
            }
        }
    }

    setCharacterSetFromPreset(characterSet) {
        this.inputCharacterSetElement.value = characterSet.join('');
        this.selectCharacterSet();
    }

    getCharacterSet() {
        const characterSet = [];

        for (let character of this.inputCharacterSetElement.value) {
            if (characterSet.indexOf(character) >= 0) continue;
            characterSet.push(character);
        }

        return characterSet;
    }

    selectCharacterSet() {
        const characterSet = this.getCharacterSet(),
            canvas = this.characterSetRangeElement,
            context = canvas.getContext('2d'),
            lightnessRangeCount = {};
        let maxLightnessCount = 0;

        this.characterLightnessSet = CanvasService.normalizeCharacterLightness(CanvasService.getCharacterLightnessSet(characterSet, App.FONT_SIZE));
        this.characterLightnessSet = this.characterLightnessSet.sort((a, b) => b.lightness - a.lightness);

        this.characterLightnessSet.forEach(function(character) {
            const lightnessString = Math.floor(character.lightness * characterSet.length).toString();

            if (!lightnessRangeCount[lightnessString]) {
                lightnessRangeCount[lightnessString] = 0;
            }

            lightnessRangeCount[lightnessString]++;
            maxLightnessCount = Math.max(lightnessRangeCount[lightnessString], maxLightnessCount);
        });

        canvas.height = 25;
        canvas.width = characterSet.length;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'rgba(0, 0, 0, .5)';

        for (let x in lightnessRangeCount) {
            context.moveTo(x, canvas.height);
            context.lineTo(x, canvas.height - (lightnessRangeCount[x] / maxLightnessCount) * canvas.height);
        }

        context.stroke();
    }

    generateAscii(image) {
        return new Promise((resolve, reject) => {
                var width = this.inputSizeElement.value,
                    height = (width / image.width) * image.height / this.inputLineHeightElement.value,
                    canvas = CanvasService.getCanvasFromImage(image, width, height),
                    context = canvas.getContext('2d'),

                    imageData = context.getImageData(0, 0, canvas.width, canvas.height),
                    imageLightnessData = CanvasService.getImageLightnessData(imageData);

                imageLightnessData.data = CanvasService.normalizeLightness(imageLightnessData.data);

                if ('Worker' in window) {
                    let worker = new Worker('assets/scripts/ascii-factory.js');
                    worker.onmessage = (e) => resolve(e.data);
                    worker.postMessage({
                        characterLightnessSet: this.characterLightnessSet,
                        imageLightnessData: imageLightnessData
                    });
                } else {
                    resolve(AsciiFactory.getAscii(this.characterLightnessSet, imageLightnessData));
                }
        });
    }

    getPresets() {
        return {
            ascii: ["_", "o"],

            // TODO: Add more emoji
            // Source: https://en.wikipedia.org/wiki/Emoji#In_the_Unicode_standard
            emoji: CharacterSetFactory.getCharacterSet(0x1F600, 0x1F64F),
            latin: Array.prototype.concat(
                CharacterSetFactory.getCharacterSet(0x20, 0x7E),
                CharacterSetFactory.getCharacterSet(0xA1, 0x17F)
            )
        };
    }

    escapeHtml(html) {
        return html.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    isValid() {
        var isValid = true;

        if (!this.image) {
            this.inputFileElement.parentNode.classList.add('form__control--error');
            isValid = false;
        }

        if (!this.inputCharacterSetElement.value) {
            this.inputCharacterSetElement.classList.add('form__control--error');
            isValid = false;
        }

        if (isNaN(parseInt(this.inputSizeElement.value)) || this.inputSizeElement.value < 2) {
            this.inputSizeElement.classList.add('form__control--error');
            isValid = false;
        }

        if (isNaN(parseFloat(this.inputLineHeightElement.value))) {
            this.inputLineHeightElement.classList.add('form__control--error');
            isValid = false;
        }

        return isValid;
    }
}

App.FONT_SIZE = 12;
App.LINE_HEIGHT = {
    ascii: 10,
    latin: 1.8,
    emoji: 1.2
};

window.App = App;
