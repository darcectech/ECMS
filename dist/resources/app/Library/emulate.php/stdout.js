
class stdout extends Framework.Library {
    constructor() {
        super();

    }

    init() {

    }

    print(c){
        console.warn('FROM PHP: ',c);
    }
}