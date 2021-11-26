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
                    $(`span:contains("${item.title}")`).each(function () {
                        if (item.title === $(this).text()) {
                            $(this).remove();
                            $(this).unbind("click");
                        }
                    })

                    liveSearchBox.append(`<span>${item.title}</span>`)

                    liveSearchBox.children("span").each(function () {
                        console.log($(this) + " :  akldsfjasdklfj");
                        $(this).click(function () {
                            const formCheckBoxHTML = `<div class="form-check">
                    <input class="form-check-input" type="checkbox" name="mainForm[knownTechnologies][${item.title}]" value="${item.icon}" id="form-check-input-${item.title}">
                    <label class="form-check-label" for="form-check-input-${item.title}">
                      ${item.title}
                    </label>
                  </div>`;
                            let count = $("label").filter(function() {
                                console.log(item.title.toLowerCase() + "  : " + $(this).text().trim().toLowerCase() === item.title.toLowerCase())
                                return $(this).text().trim().toLowerCase() === item.title.toLowerCase();
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

                            searchInput.val($(this).text());
                            liveSearchBox.empty();
                        })
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