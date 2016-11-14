
const RELS = {
    "photo": "http://schemas.google.com/contacts/2008/rel#photo",
}

export class PhoneNumber {
    title: string; //"84956054561"
    primary: boolean; //"true"
    rel: string; //"http://schemas.google.com/g/2005#mobile"
    uri: string; //"tel:+7-495-605-45-61"

    

    constructor(obj: Object) {
        this.title = obj['$t'];
        this.rel = obj['rel'];
        this.uri = obj['uri'];
    }

    static fromJSONArray(array: Array<Object>): PhoneNumber[] {
        if(typeof array !== 'undefined') 
            return array.map(obj => new PhoneNumber(obj));
        else
            return [];
    }

    
}

export class Contact {
    title: string;
    phoneNumbers: PhoneNumber[];

    links: any[]; 

    photoLink: string;
    selfLink: string;
    contactId: string;

    constructor() {

    }

    get avatar() {
        let photoLink: string = '/images/no_avatar.png';
        
        if (this.photoLink !== undefined)
            return this.photoLink;
        else
            return photoLink;
    }

    

    getPrimaryPhoneNumber() {
        if (this.phoneNumbers.length > 0)
            return this.phoneNumbers[0].title;
    }
    /*
    static fromJSONArray(array: Array<Object>, token: string): Contact[] {
        return array.map(obj => new Contact(obj, token));
    }
    */
    static getContactId(uri: string) {
        let re = new RegExp("^(http[s]?:\/\/)(.*)\/([a-zA-Z0-9]+)([?].+)?$", "gi");
        return uri.replace(re, '$3');
    }

    static updateQueryStringParameter(uri, key, value) {
        let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        let separator = uri.indexOf('?') !== -1 ? "&" : "?";
        
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }

        /*
        let separator = uri.indexOf('?') !== -1 ? "&" : "?";
        let stringValues = '';
        for (var k in key_value){
            if (key_value.hasOwnProperty(k)) {
                stringValues += k + "=" + key_value[k]
            }
        } 
        return uri + separator + stringValues;
        */
    }
}