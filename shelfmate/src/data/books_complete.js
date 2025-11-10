import annaCover from "../assets/anna-karenina.jpg";
import orwellCover from "../assets/1984.jpg";
import braveNewCover from "../assets/brave-new-world.jpg";
import catcherRyeCover from "../assets/catcher-rye.jpeg";
import crimeCover from "../assets/crime-punishment.jpg";
import donQuiCover from "../assets/don-qui.jpg";
import harryCover from "../assets/harry-potter.jpg";
import hobbitCover from "../assets/hobbit.jpg";
import janeCover from "../assets/jane-eyre.jpg";
import killCover from "../assets/kill-mockingbird.jpg";
import prideCover from "../assets/pride-prejudice.jpeg";
import lordCover from "../assets/lord-of-the-rings.jpg";
import wutheringCover from "../assets/wuthering-heights.jpg";
import middleCover from "../assets/middle-march.jpg";
import gatsbyCover from "../assets/gatsby.jpg";

export const SAMPLE_BOOKS = [
  {
    id: 1,
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    genre: "Classics",
    cover: annaCover,
    summary: "A sweeping story of love, family, and society in imperial Russia.",
    published: 1877,
    language: "Russian",
    rating: 4.7,
    amazonLink: "https://www.amazon.com/s?k=Anna+Karenina+Leo+Tolstoy"
  },
  {
    id: 2,
    title: "Don Quixote",
    author: "Miguel de Cervantes",
    genre: "Classics",
    cover: donQuiCover,
    summary: "A humorous and poignant adventure of an idealistic knight and his squire.",
    published: 1605,
    language: "Spanish",
    rating: 4.5,
    amazonLink: "https://www.amazon.com/s?k=Don+Quixote+Miguel+de+Cervantes"
  },
  {
    id: 3,
    title: "Middlemarch",
    author: "George Eliot",
    genre: "Classics",
    cover: middleCover,
    summary: "Interwoven lives in a provincial town explore love, ambition, and reform.",
    published: 1871,
    language: "English",
    rating: 4.6,
    amazonLink: "https://www.amazon.com/s?k=Middlemarch+George+Eliot"
  },
  {
    id: 4,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classics",
    cover: gatsbyCover,
    summary: "A Jazz Age tale of dreams, wealth, and longing on Long Island.",
    published: 1925,
    language: "English",
    rating: 4.8,
    amazonLink: "https://www.amazon.com/s?k=The+Great+Gatsby+F+Scott+Fitzgerald"
  },
  {
    id: 5,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    cover: prideCover,
    summary: "A witty romance of manners about love, class, and first impressions.",
    published: 1813,
    language: "English",
    rating: 4.9,
    amazonLink: "https://www.amazon.com/s?k=Pride+and+Prejudice+Jane+Austen"
  },
  {
    id: 6,
    title: "1984",
    author: "George Orwell",
    genre: "Fiction",
    cover: orwellCover,
    summary: "A dystopian portrait of surveillance, truth, and resistance.",
    published: 1949,
    language: "English",
    rating: 4.7,
    amazonLink: "https://www.amazon.com/s?k=1984+George+Orwell"
  },
  {
    id: 7,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    cover: killCover,
    summary: "A moving story of justice and conscience in the American South.",
    published: 1960,
    language: "English",
    rating: 4.8,
    amazonLink: "https://www.amazon.com/s?k=To+Kill+a+Mockingbird+Harper+Lee"
  },
  {
    id: 8,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    cover: hobbitCover,
    summary: "A reluctant hero's journey to reclaim a lost dwarf kingdom.",
    published: 1937,
    language: "English",
    rating: 4.7,
    amazonLink: "https://www.amazon.com/s?k=The+Hobbit+JRR+Tolkien"
  },
  {
    id: 9,
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    genre: "Classics",
    cover: crimeCover,
    summary: "A psychological study of guilt, redemption, and moral struggle.",
    published: 1866,
    language: "Russian",
    rating: 4.6,
    amazonLink: "https://www.amazon.com/s?k=Crime+and+Punishment+Fyodor+Dostoevsky"
  },
  {
    id: 10,
    title: "Wuthering Heights",
    author: "Emily Brontë",
    genre: "Romance",
    cover: wutheringCover,
    summary: "A tempestuous tale of passion and revenge on the moors.",
    published: 1847,
    language: "English",
    rating: 4.5,
    amazonLink: "https://www.amazon.com/s?k=Wuthering+Heights+Emily+Bronte"
  },
  {
    id: 11,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    cover: catcherRyeCover,
    summary: "A candid coming-of-age journey through alienation and hope.",
    published: 1951,
    language: "English",
    rating: 4.4,
    amazonLink: "https://www.amazon.com/s?k=The+Catcher+in+the+Rye+JD+Salinger"
  },
  {
    id: 12,
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    genre: "Romance",
    cover: janeCover,
    summary: "An orphan's quest for love and independence against the odds.",
    published: 1847,
    language: "English",
    rating: 4.7,
    amazonLink: "https://www.amazon.com/s?k=Jane+Eyre+Charlotte+Bronte"
  },
  {
    id: 13,
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Fiction",
    cover: braveNewCover,
    summary: "A provocative vision of pleasure, control, and conformity.",
    published: 1932,
    language: "English",
    rating: 4.6,
    amazonLink: "https://www.amazon.com/s?k=Brave+New+World+Aldous+Huxley"
  },
  {
    id: 14,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    cover: lordCover,
    summary: "An epic quest to destroy a dark power and save Middle-earth.",
    published: 1954,
    language: "English",
    rating: 4.9,
    amazonLink: "https://www.amazon.com/s?k=The+Lord+of+the+Rings+JRR+Tolkien"
  },
  {
    id: 15,
    title: "Harry Potter",
    author: "J.K. Rowling",
    genre: "Fantasy",
    cover: harryCover,
    summary: "A young wizard discovers friendship, courage, and destiny.",
    published: 1997,
    language: "English",
    rating: 4.8,
    amazonLink: "https://www.amazon.com/s?k=Harry+Potter+JK+Rowling"
  },
];

export const GENRE_OPTIONS = [
  "Fantasy",
  "Classics",
  "Mystery",
  "Romance",
  "Drama",
  "Young Adult",
  "Biographical",
  "Historical",
  "Fiction",
  "Autobiographical",
  "RomCom",
  "Suspense",
  "Non-Fiction",
  "Biography",
  "Memoir",
  "Graphic Novel",
  "Poetry",
  "Thriller",
  "Self-Help",
  "Philosophy",
  "Science",
  "History",
  "Horror",
  "Children",
  "Parenting",
  "Religion",
  "Business",
  "Art",
  "Music",
  "LGBTQ+",
  "Short Stories",
  "Essays",
  "Health",
  "Nature",
  "True Crime",
];
