const baseUrl = "https://cms.ieeesingapore.org";
// const baseUrl = "https://cms.ieee-singapore.syntaxgenie.com";
// const baseUrl = "http://localhost:1337";

export const apiUrl = (url, isSpecialApi = false) => {
    return `${isSpecialApi ? baseUrl.replace("cms", "api") : baseUrl}/api/${url}`;
};

export const imagePath = (path) => {
    return `${baseUrl}${path}`;
};

export const pagination = (
    numberOfPages,
    currentStartPage = 0,
    currentEndPage = 0,
    clickedPage = 0
) => {
    let startPage = 1;
    let endPage = 5;
    if (numberOfPages < 5) {
        endPage = numberOfPages;
    }

    if (currentStartPage + currentEndPage === 0) {
        currentStartPage = startPage;
        currentEndPage = endPage;
    }
    const sumOfFirstAndLastPage = currentStartPage + currentEndPage;

    if (numberOfPages > 5) {
        if (clickedPage !== 0) {
            let difference = clickedPage - sumOfFirstAndLastPage / 2;
            if (
                numberOfPages >= currentEndPage + difference &&
                0 < currentStartPage + difference
            ) {
                startPage = currentStartPage + difference;
                endPage = currentEndPage + difference;
            } else if (difference === 2 || difference === -2) {
                if (difference === 2) {
                    difference = 1;
                } else {
                    difference = -1;
                }
                if (
                    numberOfPages >= currentEndPage + difference &&
                    0 < currentStartPage + difference
                ) {
                    startPage = currentStartPage + difference;
                    endPage = currentEndPage + difference;
                } else {
                    startPage = currentStartPage;
                    endPage = currentEndPage;
                }
            } else {
                startPage = currentStartPage;
                endPage = currentEndPage;
            }
        }
    }

    const previousArrow = `<li class="page-item">
                  <a class="page-link pagination-arrow" onclick="onPreviousPagination(event, ${
                    clickedPage
                      ? clickedPage - 1 > 0
                        ? clickedPage - 1
                        : 1
                      : 1
                  })"
                    ><i
                      class="feather icon-feather-arrow-left fs-18 d-xs-none"
                    ></i
                  ></a>
                </li>`;

    const nextArrow = `<li class="page-item">
                  <a class="page-link pagination-arrow" onclick="onNextPagination(event, ${
                    clickedPage
                      ? numberOfPages > clickedPage + 1
                        ? clickedPage + 1
                        : numberOfPages
                      : numberOfPages
                  })"
                    ><i
                      class="feather icon-feather-arrow-right fs-18 d-xs-none"
                    ></i
                  ></a>
                </li>`;

    const array = Array.from({
            length: endPage - startPage + 1
        },
        (_, i) => startPage + i
    );

    let paginationContent = "";

    array.forEach((number) => {
        paginationContent += `<li class="page-item ${
      clickedPage
        ? number === clickedPage
          ? "active"
          : ""
        : number === 1
        ? "active"
        : ""
    }"><a class="page-link pagination-number" onclick="onPagination(event, ${number})">${
      number < 10 ? `0${number}` : number
    }</a></li>`;
    });

    const fullPaginationContent =
        array.length > 0 ? previousArrow + paginationContent + nextArrow : "";

    return {
        currentStartPage: startPage,
        currentEndPage: endPage,
        fullPaginationContent,
    };
};