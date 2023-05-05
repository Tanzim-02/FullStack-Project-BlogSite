// Authour: Tanzim Hossain
// Last Modified: 5.03.2023 


window.onload = function () {
    
    bookmarksHandle();
    likeDislikeHandle();
    commentHandle();
}



// Bookmark

function bookmarksHandle() {
    const bookmarks = document.getElementsByClassName('bookmark');
    [...bookmarks].forEach((item) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function(e) {
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
}

//likeDislike


function likeDislikeHandle() {
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');

    function reqLikeDislike(type, postId) {
        let headers = new Headers();
        headers.append('Accept', 'application/JSON');
        headers.append('Content-Type', 'application/json');

        let req = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            headers,
            mode: 'cors'
        });

        return fetch(req);
    }

    likeBtn.addEventListener('click', function (e) {
        let postId = likeBtn.dataset.post;
        reqLikeDislike('likes', postId)
            .then(res => res.json())
            .then(data => {
                let likeText = data.liked ? 'Liked' : 'Like';
                likeText = likeText + ` ( ${data.totalLikes} ) `;
                let dislikeText = `Dislike ( ${data.totalDislikes} ) `;

                likeBtn.innerHTML = likeText;
                dislikeBtn.innerHTML = dislikeText;
            })
            .catch(e => {
                console.log(e);
                alert(e.response.data.error);
            });
    });

    dislikeBtn.addEventListener('click', function (e) {
        let postId = dislikeBtn.dataset.post; 
        reqLikeDislike('dislikes', postId)
            .then(res => res.json())
            .then(data => {
                let dislikeText = data.disliked ? 'Disliked' : 'Dislike';
                dislikeText = dislikeText + ` ( ${data.totalDislikes} ) `;

                let likeText = `Like ( ${data.totalLikes} ) `; 

                likeBtn.innerHTML = likeText;
                dislikeBtn.innerHTML = dislikeText;
            })
            .catch(e => {
                console.log(e);
                alert(e.response.data.error);
            });
    });

}

function commentHandle() {
    const comment = document.getElementById('comment');
    const commentHolder = document.getElementById('comment-holder');

    comment.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (e.target.value) {
                let postId = comment.dataset.post;
                let data = {
                    body: e.target.value
                }

                let req = generateRequest(`/api/comments/${postId}`, 'POST', data);

                fetch(req)
                    .then(res => res.json())
                    .then(data => {
                        let commentElement = createComment(data);
                        commentHolder.insertBefore(commentElement, commentHolder.children[0]);
                        e.target.value = '';
                    })
                    .catch(e => {
                        console.log(e);
                        alert(e.message);
                    })
            } else {
                alert('Please enter a valid comment');
            }
        }
    })

    commentHolder.addEventListener('keypress', function(e){
        if(commentHolder.hasChildNodes(e.target)){
            if(e.key === 'Enter'){
                let commentId = e.target.dataset.comment;
                let value = e.target.value;

                if(value){
                    let data = {
                        body: value
                    }

                    let req = generateRequest(`/api/comments/replies/${commentId}`, 'POST', data);

                    fetch(req)
                        .then(res => res.json())
                        .then(data => {
                            let replyElement = createReplyElement(data);
                            let parent = e.target.parentElement;
                            parent.previousElementSibling.appendChild(replyElement);
                            e.target.value = '';
                        })
                        .catch(e => {
                            console.log(e);
                            alert(e.message);
                        })
                } else {
                    alert('Please enter a valid reply');
                }
            }
        }
    } )


    function generateRequest (url, method, body) {
        let headers = new Headers();
        headers.append('Accept', 'Application/JSON');
        headers.append('Content-Type', 'Application/JSON');
    
        let req = new Request(url, {
            method,
            headers,
            body: JSON.stringify(body),
            mode: 'cors'
        });
    
        return req;
    }
    
    
    
    function createComment(comment) {
        let innerHTML = `
            <img src="${comment.user.profilePics}" alt="Profile Pics" class="rounded-circle mx-3 my-3" style="width: 40px;">
            <div class="media-body my-3">
                <p>${comment.body}</p>
                <div class="my-3">
                    <input type="text" class="form-control" placeholder="Press Enter to Reply" name="reply" data-comment="${comment._id}">
                </div>
            </div>
        `;
    
        let div = document.createElement('div');
        div.className = 'media border';
        div.innerHTML = innerHTML;
    
        return div;
    }
    
    
    function createReplyElement(reply) {
        let innerHTML = `
            <img src="${reply.profilePics}" alt="Profile Pics" class="rounded-circle mx-3 my-3" style="width: 40px;">
            <div class="media-body my-3">
                <p>${reply.body}</p>
            </div>
        `;
    
        let div = document.createElement('div');
        div.className = 'media mt-3';
        div.innerHTML = innerHTML;
    
        return div;
    }


}










