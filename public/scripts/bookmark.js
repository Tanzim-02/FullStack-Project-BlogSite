window.onload = function () {
  const bookmarks = document.getElementsByClassName('bookmark');
  [...bookmarks].forEach((item) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function (e) {
      let target = e.target.parentElement;

      let headers = new Headers();
      headers.append('Accept', 'Application/JSON');

      let req = new Request(`/api/bookmark/${target.dataset.post}`, {
        method: 'GET',
        headers,
        mode: 'cors'
      });

      fetch(req)
        .then(res => res.json())
        .then(data => {
          if (data.bookmark) {
            target.innerHTML = '<i class="fas fa-bookmark"></i>';
          } else {
            target.innerHTML = '<i class="far fa-bookmark"></i>';
          }
        })
        .catch(e => {
          console.log(e.response.data);
          alert(e.response.data.error);
        });
    });
  });
};
