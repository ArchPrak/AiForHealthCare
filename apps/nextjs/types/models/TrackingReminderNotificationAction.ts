/**
 * Decentralized FDA API
 * A platform for quantifying the effects of every drug, supplement, food, and other factor on your health.
 *
 * OpenAPI spec version: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



export class TrackingReminderNotificationAction {
    /**
    * Ex: track
    */
    'action': string;
    /**
    * Ex: trackThreeRatingAction
    */
    'callback': string;
    /**
    * Ex: 3
    */
    'modifiedValue': number;
    /**
    * Ex: 3/5
    */
    'title': string;
    /**
    * Ex: Rate 3/5
    */
    'longTitle'?: string;
    /**
    * Ex: 3
    */
    'shortTitle'?: string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "action",
            "baseName": "action",
            "type": "string",
            "format": ""
        },
        {
            "name": "callback",
            "baseName": "callback",
            "type": "string",
            "format": ""
        },
        {
            "name": "modifiedValue",
            "baseName": "modifiedValue",
            "type": "number",
            "format": ""
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string",
            "format": ""
        },
        {
            "name": "longTitle",
            "baseName": "longTitle",
            "type": "string",
            "format": ""
        },
        {
            "name": "shortTitle",
            "baseName": "shortTitle",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return TrackingReminderNotificationAction.attributeTypeMap;
    }

    public constructor() {
    }
}

