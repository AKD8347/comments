class Author {
	public name: any;
	public icon: any;

    constructor(author: { name: any; icon: any; }) {
        this.name = author.name
        this.icon = author.icon
    }
}
