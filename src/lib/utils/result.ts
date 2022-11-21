import logger from 'src/lib/utils/logger.js';

class Result {
    private readonly _document;
    private readonly _resultId;
    private readonly _searchURL;
    private readonly _pdfUrlTemplate;
    private readonly _itemURLTemplate;
    private readonly metadataShape = {
        exactKeys: [
            'name',
            'category',
            'providerId',
            'dukey',
            'duStation',
            'mediumKey',
            'mediumStation',
            'classicStationId',
        ],
        typeOfValue: 'string',
    };

    constructor(successMsg: MessageSuccess, source: Source) {
        logger(LoggerStatus.RESULT, 'Parsing article xml');
        this._document = new DOMParser().parseFromString(
            successMsg.message.rawXMLData,
            'text/xml'
        );

        this._pdfUrlTemplate = `${source.baseURL}${source.paths.pdf}`;
        this._itemURLTemplate = `${source.baseURL}${source.paths.item}`;
        this._searchURL = successMsg.message.searchURL;
        this._resultId = successMsg.message.resultId;
    }

    asData(): ResultData {
        return {
            text: this._getText(),
            pdfURL: this._getPDFURL(),
            itemURL: this._getItemURL(),
            searchURL: this._searchURL,
        };
    }

    private _getItemURL() {
        return this._itemURLTemplate.replace('{resultId}', this._resultId);
    }
    private _getPDFURL() {
        const metadata = this._getMetadata();
        let pdfURL = this._pdfUrlTemplate;
        Object.keys(metadata).forEach((key) => {
            pdfURL = pdfURL.replace(
                `{${key}}`,
                key === 'mediumKey'
                    ? metadata[key]
                    : encodeURIComponent(metadata[key as keyof typeof metadata])
            );
        });
        logger(LoggerStatus.RESULT, `Generated PDF URL: ${pdfURL}`);
        return encodeURI(pdfURL);
    }

    private _getText() {
        const values = this._document
            .getElementById('article_content_text')
            ?.getElementsByTagName('ns4:value');
        if (values === undefined || values.length === 0)
            throw new Error('Text not found');
        const text = values[0].firstChild?.nodeValue;
        if (typeof text !== 'string') throw new Error('Text not found');
        logger(LoggerStatus.RESULT, `Found text: ${text}`);
        return text;
    }

    private _getMetadata() {
        const assets = this._document.getElementsByTagName('tag0:asset');
        if (assets.length === 0)
            throw new Error('Metadata: Result has no binary assets');
        const metadataRoot = assets[0];

        const rootAttrs = metadataRoot.attributes;
        const nameCategory = Object.fromEntries(
            ['name', 'category'].map((attr) => [
                attr,
                rootAttrs.getNamedItem(attr)?.value,
            ])
        );
        if (nameCategory?.category !== 'pdf')
            throw new Error('Metadata: Asset is not a PDF');

        const childAttrs = Array.from(
            metadataRoot.getElementsByTagName('tag0:attribute')
        );
        const metadata = Object.fromEntries(
            childAttrs.map((element) => [
                element.getAttribute('name'),
                element.getAttribute('value'),
            ])
        );

        const allMetadata = {
            ...nameCategory,
            ...metadata,
        };

        if (this._isOfMetadataShape(allMetadata)) return allMetadata;
        throw new Error(
            `Metadata: Shape of metadata is unexpected (Details: ${JSON.stringify(
                allMetadata
            )}`
        );
    }

    private _isOfMetadataShape(obj: any): obj is ResultMetadata {
        return (
            typeof obj === 'object' &&
            this.metadataShape.exactKeys.length === Object.keys(obj).length &&
            this.metadataShape.exactKeys.every(
                (key) =>
                    key in obj && typeof obj[key] === this.metadataShape.typeOfValue
            )
        );
    }
}

export default Result;
