// Book klasa
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI klasa
class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        // Kreiramo tr element
        const row = document.createElement('tr');
        // Dodavanje kolona
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
    
        list.appendChild(row);
    }

    showAlert(message, className) {
        // Kreiranje div-a
        const div = document.createElement('div');
        // Dodavanje klasa
        div.className = `alert ${className}`;
        // Dodavanje teksta
        div.appendChild(document.createTextNode(message));
        // Dohvaćanje parenta
        const container = document.querySelector('.container');
        // Dohvaćanje forme
        const form = document.querySelector('#book-form');
        // Umetanje upozorenja
        container.insertBefore(div, form);
        // Timeout nakon 3 sek (upozorenje nestaje)
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage klasa
class Store {

    // sve ove metode su statične (static) što znači da ih ne pozivaju instance klase, nego se pozivaju iz same klase

    // fetchiranje knjiga iz local storagea
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            // kad primimo podatke sa servera oni su uvijek string, pa ih zato parsiramo sa JSON.parse() metodom da bi postali JavaScript objekt
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    // prikazivanje knjiga u UI-ju
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI;

            // Dodavanje knjige u UI
            ui.addBookToList(book);
        });
    }
    // dodavanje knjiga u local storage
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        // kad se podatak šalje na server mora biti string, zato ovaj array pretvaramo u string pomoću metode JSON.stringify()
        localStorage.setItem('books', JSON.stringify(books));
    }

    // brisanje knjige iz local storagea
    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn) {
               books.splice(index, 1); // splice metodom uklanjamo iteme iz arraya, index je pozicija na kojoj se nalaze, a 1 je broj koliko ih želimo ukloniti 
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event listener za dodavanje knjige
document.getElementById('book-form').addEventListener('submit', function(e){
    // dohvaćamo vrijednosti unesene u input polja (value)
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value
    
    
    // Instanciramo objekt book
    const book = new Book(title, author, isbn);

    // Instanciramo UI objekt
    const ui = new UI();

    // Validacija
    if(title === '' || author === '' || isbn === '') {
        // Error alert
        ui.showAlert('Molimo, popunite sva polja!', 'error');
    }
    else {
         // Dodavanje knjige na popis
        ui.addBookToList(book);

        // Dodavanje knjige u local storage
        Store.addBook(book);

        // Prikaži uspješno dodavanje knjige (succes)
        ui.showAlert('Knjiga je dodana!', 'success');

        // Očisti input polja
        ui.clearFields();
    }

    e.preventDefault();
});

// Event listener za brisanje knjige
document.getElementById('book-list').addEventListener('click', function(e){

    // Instanciramo UI
    const ui = new UI();

   // Izbriši knjigu
    ui.deleteBook(e.target);
  
    // Ukloni knjigu iz Local Storagea
    // potrebno nam je nešto jedinstveno za svaku knjigu, a to je isbn, njega ćemo dobiti tako da ciljamo iksić (a element), pa njegov parent (td), a njegov prethodni sibling td sadrži tekst koji je isbn koji nam je potreban
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

   // Prikaži poruku
   ui.showAlert('Knjiga je izbrisana!', 'success');

    e.preventDefault();

})