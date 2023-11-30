const COHORT = "2310-GHP-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/artists`;

const state = {
  artists: [],
};

const artistList = document.querySelector("#artists");
artistList.addEventListener("click", deleteArtist)

const addArtistForm = document.querySelector("#addArtist");
addArtistForm.addEventListener("submit", addArtist);

async function render() {
  await getArtists();
  renderArtists();
}
render();

function renderArtists() {
  console.log(state.artists)
  if (!state.artists.length) {
    artistList.innerHTML = "<li>No artists.</li>";
    return;
  }

  const artistCards = state.artists.map((artist) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${artist.name}</h2>
      <img src="${artist.imageUrl}" alt="${artist.name}" />
      <p>${artist.description}</p>
      `;

      //delete artist
      const deleteButton = document.createElement('button')
      deleteButton.textContent = "Delete Artist"
      li.append(deleteButton)

      deleteButton.addEventListener("click", () => deleteArtist(artist.id))

      //edit artist
      const editButton = document.createElement('button')
      editButton.textContent = "Edit Artist"
      li.append(editButton)

      editButton.addEventListener("click", () => editArtist(artist.id))

    return li;
  });

  artistList.replaceChildren(...artistCards);
}

//Read
async function getArtists() {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      console.log(response)
      state.artists = json.data;
    } catch (error) {
      console.error(error);
    }
  }

//Create
async function addArtist(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addArtistForm.name.value,
        imageUrl: addArtistForm.imageUrl.value,
        description: addArtistForm.description.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create artist");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

// Update
async function editArtist(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addArtistForm.name.value,
        imageUrl: addArtistForm.imageUrl.value,
        description: addArtistForm.description.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create artist");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

// Delete
async function deleteArtist(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })

    render()
  } catch (error) {
    console.error(error)
  }
}
