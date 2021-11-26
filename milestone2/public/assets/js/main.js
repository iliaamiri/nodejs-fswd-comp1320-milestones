
const bootstrapAlertHtml = `<div class="alert alert-danger alert-dismissible fade show" role="alert" id="error-box">
              <strong id="error-title">Holy guacamole!</strong><span id="error-detail">You should check in on some of those fields below.</span>
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>`;

function clickMainForm() {
    event.preventDefault();
    const form = $('#main-form');
    $.post('/devCards/create', form.serialize(), (res) => {
        let result = JSON.parse(res);
        let status = result.status;

        const headerTag = $('#header-box');
        if (!status) {
            return headerTag.append(`<div class="alert alert-danger alert-dismissible fade show" role="alert" id="error-box">
              <strong id="error-title">Error:</strong><span id="error-detail"> ${result.msg}</span>
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>`)
        } else {
            return headerTag.append(`<div class="alert alert-success alert-dismissible fade show" role="alert" id="error-box">
              <strong id="error-title">Error:</strong><span id="error-detail"> ${result.msg}</span>
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>`)
        }


    })
}
