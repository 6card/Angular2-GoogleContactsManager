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

    photoLink: string;
    selfLink: string;
    _contactId: string;

    constructor(obj: Object) {
        this.title = obj['title']['$t'];
        if (obj['gd$phoneNumber'])
            this.phoneNumbers = obj['gd$phoneNumber'].map( number => new PhoneNumber(number) );
        obj['link'].map(item => {
            if (item['rel'] == RELS['photo'] && item['gd$etag'] !== undefined)
                this.photoLink = item['href']; 
            else if (item['rel'] == 'self')                
                this.selfLink = item['href'];
            else if (item['rel'] == 'edit')      
                this._contactId = item['href'];        
        });
    }

    get primaryPhoneNumber() {
        if (this.phoneNumbers && this.phoneNumbers.length > 0)
            return this.phoneNumbers[0].title;
    }
    
    get contactId() {
        let re = new RegExp("^(http[s]?:\/\/)(.*)\/([a-zA-Z0-9]+)([?].+)?$", "gi");
        let uri = this._contactId;
        return uri.replace(re, '$3');
    }

}