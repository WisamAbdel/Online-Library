//loading gif
const spinner        = $('#spinner-loading');
const infoAlert      = $('#info-alert');

//form selectors
const uploadForm     = $( '#uploadForm' );
const uploadFormShow = $( '#btn-upload' );
const uploadFormAdd  = $( '#upload-book' );
const uploadErr      = $( '#upload-err-msg' );
const uploadImage    = $( '#bookThumbnail' );


//upload form
uploadFormShow.on('click' , () => uploadForm.slideToggle("fast")) ;
uploadFormAdd.on('submit' , () => {

    //override default behavior for submit
    event.preventDefault();
    event.stopPropagation();

    //hide for processing
    uploadForm.slideToggle("fast");
    spinner.show();
    
    //upload selectors
    var uploadBookTitle         = $( '#book-title' );
    var uploadBookAuthor        = $( '#book-author' );
    var uploadBookDatePublished = $( '#book-date-published' );
    var uploadBookReview        = $( '#book-review' );
    var uploadBookFile          = $( '#bookThumbnail' );

    var book_data_form = new FormData(this);

    //gather data
    book_data_form.append('bookTitle'     , uploadBookTitle.val());
    book_data_form.append('bookAuthor'    , uploadBookAuthor.val());
    book_data_form.append('datePublished' , uploadBookDatePublished.val());
    book_data_form.append('bookReview'    , uploadBookReview.val());


    //upload files if any
    try {
        book_data_form.append('bookThumbnail' , files[0]);
    }  catch (e) {
        if(e.name != "ReferenceError") {
            console.log(e);
    }
}
  //POST - add book contents to DB
  $.ajax({
      type       : "POST",
      processData: false,
      contentType: false,
      cache      : false,
      url        : "/books/upload",
      data       : book_data_form,
      statusCode : {
          405 : (res) => { //failed
               let error = res.responseJSON["details"][0]["message"];
               uploadErr.html(`<center><i class="fas fa-exclamation-triangle"></i> ${error} </center>`);
               uploadErr.show();
               spinner.hide();
               uploadForm.slideToggle("fast");

            },
          200 : (res) => {
              spinner.hide(); //successful
              uploadErr.hide();
              //empty fields
              uploadErr.html('');
              uploadBookTitle.val('');
              uploadBookAuthor.val('');
              uploadBookDatePublished.val('');
              uploadBookReview.val('');
              uploadBookFile.val('');

              let success = res;
              infoAlert.html(` <i class="far fa-check-circle"></i> ${success} `);
              infoAlert.show();
              setTimeout( () => infoAlert.fadeOut('slow') , 5000);
          },
          500 : (res) => { //internal error
            let err = res['responseText'];
            uploadErr.html(`<center><i class="fas fa-exclamation-triangle"></i> 500 ${err} </center>`);
            uploadErr.show();
            spinner.hide();
            uploadForm.slideToggle("fast");
          }
      }
  });

})
var valid_file_formats = ['jpg' , 'png' , 'jpeg'];
//validating file uploads
uploadImage.on('change' , () => {
    uploadErr.hide();
    if(!uploadImage.val()) return

    //grabbing file extension
    var file = uploadImage[0].files[0];
    var file_extension = uploadImage.val().split('.')[uploadImage.val().split('.').length-1].toString().toLowerCase();

    if( valid_file_formats.indexOf(file_extension) != -1) {
        if ( file.size >= 2000000 ) { //2MB or Less
            let error = "File size exceeds 2MB";
            uploadErr.html(`<center><i class="fas fa-exclamation-triangle"></i> ${error} </center>`);
            uploadErr.show();
        }  else {
            //validation successful
            files = event.target.files;
        }
    } else {
        let error = "Invalid file format. (.jpg , .jpeg, .png) only";
        uploadErr.html(`<center><i class="fas fa-exclamation-triangle"></i> ${error} </center>`);
        uploadErr.show();
                 }
});
