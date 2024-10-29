// En constructor funktion der skaber nogle objekter
function Album(artist, album, totalTracks, releaseYear) {
    this.artist = artist;
    this.album = album;
    this.totalTracks = totalTracks;
    this.releaseYear = releaseYear;
}

// En funktion der tilføjer en div til html-siden
function addDivWithAlbum(album, parentid) {
    let parentElement = document.getElementById(parentid);
    let elementToAdd =
    "<div>" +
    "Artist: " +
    album.artist +
    " | Album: " +
    album.album +
    " | Antal tracks: " +
    album.totalTracks +
    " | Udgivelsesår: " +
    album.releaseYear +
    "</div>";
    parentElement.innerHTML = parentElement.innerHTML + elementToAdd;
}

 // Her fetcher vi dataen
 fetchContent("albums.json").then((albums) => {
    console.log("Original Data: ");
    console.log(albums);

    let albumObjects = [];

    console.log("To be populated: ");
    console.log(albumObjects);

    for (let i = 0; i < albums.length; i++) {
        const album = new Album(
            albums[i].artistName,
            albums[i].albumName,
            albums[i].trackList.length,
            albums[i].productionYear
        );
        albumObjects.push(album);
    }

console.log("Object Data: ");
console.log(albumObjects);

console.log("Test: ");
console.log(albumObjects[7].totalTracks);

albumObjects.forEach(

    function (a) {
        addDivWithAlbum(a, "content");
    }
)
 });
 
 
// Noget magi jeg endnu ikke kender til, men af grunde skal have med
 async function fetchContent(url) {
    let request = await fetch(url);
    let json = await request.json();
    return json;
 }