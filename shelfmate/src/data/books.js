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
import warCover from "../assets/war-and-peace.jpg";
import animalFarmCover from "../assets/animal-farm.jpg";
import chroniclesCover from "../assets/chronicles-of-narnia.jpg";
import emmaCover from "../assets/emma.jpg";
import brothersKaramazovCover from "../assets/brothers-karamazov.jpg";
import senseCover from "../assets/sense-sensibility.jpg";
import silmarillionCover from "../assets/silmarillion.jpg";
import tenderCover from "../assets/tender-is-the-night.jpg";
import frannyZooeyCover from "../assets/franny-and-zooey.jpg";
import islandCover from "../assets/island.jpg";   

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
    amazonLink: "https://www.amazon.com/Anna-Karenina-Leo-Tolstoy/s?k=Anna+Karenina"
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
    amazonLink: "https://www.amazon.com/Don-Quixote-Miguel-Cervantes/s?k=Don+Quixote"
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
    rating: 4.4,
    amazonLink: "https://www.amazon.com/Middlemarch-George-Eliot/s?k=Middlemarch"
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
    rating: 4.6,
    amazonLink: "https://www.amazon.com/Great-Gatsby-F-Scott-Fitzgerald/s?k=The+Great+Gatsby"
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
    rating: 4.8,
    amazonLink: "https://www.amazon.com/Pride-Prejudice-Jane-Austen/s?k=Pride+and+Prejudice"
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
    amazonLink: "https://www.amazon.com/1984-George-Orwell/s?k=1984"
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
    amazonLink: "https://www.amazon.com/Kill-Mockingbird-Harper-Lee/s?k=To+Kill+a+Mockingbird"
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
    amazonLink: "https://www.amazon.com/Hobbit-J-R-R-Tolkien/s?k=The+Hobbit"
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
    amazonLink: "https://www.amazon.com/Crime-Punishment-Fyodor-Dostoevsky/s?k=Crime+and+Punishment"
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
    amazonLink: "https://www.amazon.com/Wuthering-Heights-Emily-Bronte/s?k=Wuthering+Heights"
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
    amazonLink: "https://www.amazon.com/Catcher-Rye-J-D-Salinger/s?k=The+Catcher+in+the+Rye"
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
    amazonLink: "https://www.amazon.com/Jane-Eyre-Charlotte-Bronte/s?k=Jane+Eyre"
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
    rating: 4.5,
    amazonLink: "https://www.amazon.com/Brave-New-World-Aldous-Huxley/s?k=Brave+New+World"
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
    rating: 4.8,
    amazonLink: "https://www.amazon.com/Lord-Rings-J-R-R-Tolkien/s?k=The+Lord+of+the+Rings"
  },
  {
    id: 15,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    cover: harryCover,
    summary: "A young wizard discovers friendship, courage, and destiny.",
    published: 1997,
    language: "English",
    rating: 4.9,
    amazonLink: "https://www.amazon.com/Harry-Potter-Philosophers-Stone-Rowling/s?k=Harry+Potter"
  },
  {
    id: 16,
    title: "War and Peace",
    author: "Leo Tolstoy",
    genre: "Classics",
    cover: warCover,
    summary: "An epic tale of five families navigating love and war in Napoleonic Russia.",
    published: 1869,
    language: "Russian",
    rating: 4.6,
    amazonLink: "https://www.amazon.com/s?k=War+and+Peace+Leo+Tolstoy"
  },
  {
    id: 17,
    title: "Animal Farm",
    author: "George Orwell",
    genre: "Fiction",
    cover: animalFarmCover,
    summary: "A satirical allegory of totalitarianism and corrupted ideals.",
    published: 1945,
    language: "English",
    rating: 4.5,
    amazonLink: "https://www.amazon.com/s?k=Animal+Farm+George+Orwell"
  },
  {
    id: 18,
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    genre: "Fantasy",
    cover: chroniclesCover,
    summary: "Magical adventures in a wondrous world beyond the wardrobe.",
    published: 1950,
    language: "English",
    rating: 4.7,
    amazonLink: "https://www.amazon.com/s?k=Chronicles+of+Narnia"
  },
  {
    id: 19,
    title: "Emma",
    author: "Jane Austen",
    genre: "Romance",
    cover: emmaCover,
    summary: "A matchmaker learns valuable lessons about love and friendship.",
    published: 1815,
    language: "English",
    rating: 4.4,
    amazonLink: "https://www.amazon.com/s?k=Emma+Jane+Austen"
  },
  {
    id: 20,
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    genre: "Classics",
    cover: brothersKaramazovCover,
    summary: "A profound exploration of faith, doubt, and family dynamics.",
    published: 1880,
    language: "Russian",
    rating: 4.7,
    amazonLink: "https://www.amazon.com/s?k=Brothers+Karamazov"
  },
  {
    id: 21,
    title: "Sense and Sensibility",
    author: "Jane Austen",
    genre: "Romance",
    cover: senseCover,
    summary: "Two sisters navigate love, heartbreak, and societal expectations.",
    published: 1811,
    language: "English",
    rating: 4.5,
    amazonLink: "https://www.amazon.com/s?k=Sense+and+Sensibility"
  },
  {
    id: 22,
    title: "The Silmarillion",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    cover: silmarillionCover,
    summary: "The mythological foundation of Middle-earth and its ancient histories.",
    published: 1977,
    language: "English",
    rating: 4.4,
    amazonLink: "https://www.amazon.com/s?k=The+Silmarillion"
  },
  {
    id: 23,
    title: "Tender Is the Night",
    author: "F. Scott Fitzgerald",
    genre: "Classics",
    cover: tenderCover,
    summary: "A tragic romance set against the glamour of the French Riviera.",
    published: 1934,
    language: "English",
    rating: 4.3,
    amazonLink: "https://www.amazon.com/s?k=Tender+Is+the+Night"
  },
  {
    id: 24,
    title: "Franny and Zooey",
    author: "J.D. Salinger",
    genre: "Fiction",
    cover: frannyZooeyCover,
    summary: "Two siblings grapple with spiritual crisis and family bonds.",
    published: 1961,
    language: "English",
    rating: 4.2,
    amazonLink: "https://www.amazon.com/s?k=Franny+and+Zooey"
  },
  {
    id: 25,
    title: "Island",
    author: "Aldous Huxley",
    genre: "Fiction",
    cover: islandCover,
    summary: "A utopian vision exploring enlightenment and human potential.",
    published: 1962,
    language: "English",
    rating: 4.3,
    amazonLink: "https://www.amazon.com/s?k=Island+Aldous+Huxley"
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
