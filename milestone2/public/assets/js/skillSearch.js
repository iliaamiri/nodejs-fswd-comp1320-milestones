const searchInput = $('#skill-search-input');
const liveSearchBox = $('#live-search-result');

const leftSideFormCheckSkills = $('#left-side-form-check-skills');
const rightSideFormCheckSkills = $('#right-side-form-check-skills');

$(document).ready(() => {
    searchInput.keyup(function () {
        let newValue = $(this).val();
        getIcon(newValue)
            .then(result => {
                result.map(item => {
                    let spanAlreadyExists = false;
                    $(`span:contains("${item.title}")`).each(function () {
                        if (item.title === $(this).text()) {
                            spanAlreadyExists = true;
                        }
                    })

                    if (!spanAlreadyExists) {
                        liveSearchBox.append(`<span>${item.title}</span>`)


                    }
                    return item;
                })
            })
            .then(() => {
                liveSearchBox.children("span").each(function () {
                    console.log($(this).text());
                    $(this).click(function () {
                        let eachSpan = $(this);
                        const formCheckBoxHTML = `<div class="form-check">
                    <input class="form-check-input" type="checkbox" name="mainForm[knownTechnologies][${$(this).text()}]" value="${$(this).text()}" id="form-check-input-${$(this).text()}">
                    <label class="form-check-label" for="form-check-input-${$(this).text()}">
                      ${$(this).text()}
                    </label>
                  </div>`;
                        let count = $("label").filter(function() {
                            return $(this).text().trim().toLowerCase() === eachSpan.text().trim().toLowerCase();
                        }).length

                        if (count === 0) {
                            if (leftSideFormCheckSkills.children().length - rightSideFormCheckSkills.children().length < 0) {
                                leftSideFormCheckSkills.append(formCheckBoxHTML)
                            } else {
                                rightSideFormCheckSkills.append(formCheckBoxHTML)
                            }
                        } else {
                            console.log("This skill is already available to select");
                        }

                        searchInput.val("");
                        liveSearchBox.empty();
                    })
                })
            })
            .catch(err => {
                liveSearchBox.empty()
            })
    });


    searchInput
        .focus(function () {
            liveSearchBox.css('display', 'block');
        })
    // .focusout(function () {
    //     liveSearchBox.css('display', 'none');
    // })


})

function getIcon(title) {
    return new Promise((resolve, reject) => {
        $.get(`/getIcon/${title}`, (res) => {
            let result = JSON.parse(res);
            if (result.status) {
                resolve(result.icon);
            } else {
                reject({
                    "title": "Not Found",
                    "icon": ""
                })
            }
        })
    })
}