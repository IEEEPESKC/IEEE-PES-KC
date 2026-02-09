import {
    apiUrl,
    imagePath
} from "./custom.js";

let upcomingEventsLength = 0;
let socialMediaPostsLength = 0;

const showNextAndPreviousNavigationOfUpcomingEvents = () => {
    const upcomingEventsPreviousNavigation = document.getElementById(
        "upcoming-events-previous-navigation"
    );
    const upcomingEventsNextNavigation = document.getElementById(
        "upcoming-events-next-navigation"
    );

    const width = window.innerWidth;

    if (upcomingEventsLength > 3) {
        upcomingEventsPreviousNavigation.style.display = "flex";
        upcomingEventsNextNavigation.style.display = "flex";
    } else if (upcomingEventsLength > 2) {
        if (width < 992) {
            upcomingEventsPreviousNavigation.style.display = "flex";
            upcomingEventsNextNavigation.style.display = "flex";
        } else {
            upcomingEventsPreviousNavigation.style.display = "none";
            upcomingEventsNextNavigation.style.display = "none";
        }
    } else if (upcomingEventsLength > 1) {
        if (width < 768) {
            upcomingEventsPreviousNavigation.style.display = "flex";
            upcomingEventsNextNavigation.style.display = "flex";
        } else {
            upcomingEventsPreviousNavigation.style.display = "none";
            upcomingEventsNextNavigation.style.display = "none";
        }
    } else {
        upcomingEventsPreviousNavigation.style.display = "none";
        upcomingEventsNextNavigation.style.display = "none";
    }
};

const showNextAndPreviousNavigationOfSocialMediaPosts = () => {
    const socialMediaPreviousNavigation = document.getElementById(
        "social-media-previous-navigation"
    );
    const socialMediasNextNavigation = document.getElementById(
        "social-media-next-navigation"
    );

    const width = window.innerWidth;

    if (socialMediaPostsLength > 3) {
        socialMediaPreviousNavigation.style.display = "flex";
        socialMediasNextNavigation.style.display = "flex";
    } else if (socialMediaPostsLength > 2) {
        if (width < 1201) {
            socialMediaPreviousNavigation.style.display = "flex";
            socialMediasNextNavigation.style.display = "flex";
        } else {
            socialMediaPreviousNavigation.style.display = "none";
            socialMediasNextNavigation.style.display = "none";
        }
    } else if (socialMediaPostsLength > 1) {
        if (width < 768) {
            socialMediaPreviousNavigation.style.display = "flex";
            socialMediasNextNavigation.style.display = "flex";
        } else {
            socialMediaPreviousNavigation.style.display = "none";
            socialMediasNextNavigation.style.display = "none";
        }
    } else {
        socialMediaPreviousNavigation.style.display = "none";
        socialMediasNextNavigation.style.display = "none";
    }
};

function formatDate(dateString) {
    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric"
    };
    const formattedDate = new Date(dateString)
        .toLocaleDateString("en-GB", options)
        .replace(",", "");
    return formattedDate;
}

const heroSlider = document.getElementById("demo-corporate-slider");

window.addEventListener("DOMContentLoaded", async function() {
    await axios
        .get(apiUrl("homepage-hero"), {
            params: {
                populate: {
                    heroSection: {
                        populate: {
                            image: {
                                fields: ["alternativeText", "url"],
                            },
                            linkButton: {
                                populate: "*",
                            },
                        },
                    },
                },
            },
        })
        .then((res) => {
            let heroSliderContent = "";

            res.data.data.heroSection.forEach((hs, index) => {
                heroSliderContent += `
            <li
              data-index="rs-0${index + 1}"
              data-transition="parallaxleft"
              data-slotamount="default"
              data-hideafterloop="0"
              data-hideslideonmobile="off"
              data-easein="default"
              data-easeout="default"
              data-masterspeed="1500"
              data-rotate="0"
              data-saveperformance="off"
              data-title="Crossfit"
              data-param1=""
              data-param2=""
              data-param3=""
              data-param4=""
              data-param5=""
              data-param6=""
              data-param7=""
              data-param8=""
              data-param9=""
              data-param10=""
              data-description=""
            >
              <!-- slide's main background image -->
              <img
                src="${`${imagePath(hs.image.url)}`}"
                alt="${hs.image.alternativeText}"
                data-bgposition="center center"
                data-bgfit="cover"
                data-bgrepeat="no-repeat"
                class="rev-slidebg"
                data-no-retina
              />
              <!-- start overlay layer -->
              ${
                hs.mainTitle
                  ? `<div
                class="tp-caption tp-shape tp-shapewrapper"
                id="slide-${index + 1}-layer-01"
                data-x="['center','center','center','center']"
                data-hoffset="['0','0','0','0']"
                data-y="['middle','middle','middle','middle']"
                data-voffset="['0','0','0','0']"
                data-width="full"
                data-height="full"
                data-whitespace="nowrap"
                data-type="shape"
                data-basealign="slide"
                data-responsive_offset="off"
                data-responsive="off"
                data-frames='[{"delay":0,"speed":1000,"frame":"0","from":"opacity:0;","to":"o:1;","ease":"Power4.easeInOut"},
                                   {"delay":"wait","speed":1000,"frame":"999","to":"opacity:0;","ease":"Power4.easeInOut"}]'
                style="background: rgba(22, 35, 63, 0.1); z-index: 0"
              ></div>`
                  : ""
              }
              <!-- end overlay layer -->
              <!-- start shape layer -->
              ${
                hs.mainTitle
                  ? `<div
                class="tp-caption tp-shape tp-shapewrapper tp-resizeme bg-regal-blue border-radius-50"
                id="slide-${index + 1}-layer-02"
                data-x="['center','center','center','center']"
                data-hoffset="['0','0','0','0']"
                data-y="['middle','middle','middle','middle']"
                data-voffset="['0','0','0','0']"
                data-width="['900','700','700','600']"
                data-height="['900','700','700','600']"
                data-whitespace="nowrap"
                data-type="shape"
                data-responsive_offset="on"
                data-frames='[{"delay":1000,"speed":1000,"frame":"0","from":"x:0px;y:50px;rX:0deg;rY:0deg;rZ:0deg;sX:0.5;sY:0.5;opacity:0;","to":"o:0.5;","ease":"Back.easeOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"Power3.easeInOut"}]'
                data-textAlign="['inherit','inherit','inherit','inherit']"
                data-paddingtop="[0,0,0,0]"
                data-paddingright="[0,0,0,0]"
                data-paddingbottom="[0,0,0,0]"
                data-paddingleft="[0,0,0,0]"
                style="z-index: 0"
              ></div>`
                  : ""
              }
              <!-- end shape layer -->
              <!-- start shape layer -->
              ${
                hs.mainTitle
                  ? `<div
                class="tp-caption tp-shape tp-shapewrapper tp-resizeme bg-regal-blue border-radius-50"
                id="slide-${index + 1}-layer-03"
                data-x="['center','center','center','center']"
                data-hoffset="['0','0','0','0']"
                data-y="['middle','middle','middle','middle']"
                data-voffset="['0','0','0','0']"
                data-width="['1200','1000','900','800']"
                data-height="['1200','1000','900','800']"
                data-whitespace="nowrap"
                data-type="shape"
                data-responsive_offset="on"
                data-frames='[{"delay":1300,"speed":1000,"frame":"0","from":"x:0px;y:50px;rX:0deg;rY:0deg;rZ:0deg;sX:0.5;sY:0.5;opacity:0;","to":"o:0.3;","ease":"Back.easeOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"Power3.easeInOut"}]'
                data-textAlign="['inherit','inherit','inherit','inherit']"
                data-paddingtop="[0,0,0,0]"
                data-paddingright="[0,0,0,0]"
                data-paddingbottom="[0,0,0,0]"
                data-paddingleft="[0,0,0,0]"
                style="z-index: 0"
              ></div>`
                  : ""
              }
              <!-- end shape layer -->
              <!-- start row zone layer -->
              ${
                hs.mainTitle
                  ? `<div id="rrzm_${
                      638 + index + 1
                    }" class="rev_row_zone rev_row_zone_middle">
                <!-- start row layer -->
                <div
                  class="tp-caption"
                  id="slide-${index + 1}-layer-04"
                  data-x="['left','left','left','left']"
                  data-hoffset="['0','0','0','0']"
                  data-y="['middle','middle','middle','middle']"
                  data-voffset="['-426','-426','-426','-426']"
                  data-width="none"
                  data-height="none"
                  data-whitespace="nowrap"
                  data-type="row"
                  data-columnbreak="3"
                  data-responsive_offset="on"
                  data-responsive="off"
                  data-frames='[{"delay":10,"speed":300,"frame":"0","from":"opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"Power3.easeInOut"}]'
                  data-textAlign="['inherit','inherit','inherit','inherit']"
                  data-paddingtop="[0,0,0,0]"
                  data-paddingright="[100,75,50,30]"
                  data-paddingbottom="[0,0,0,0]"
                  data-paddingleft="[100,75,50,30]"
                >
                  <!-- start column layer -->
                  <div
                    class="tp-caption"
                    id="slide-${index + 1}-layer-05"
                    data-x="['left','left','left','left']"
                    data-hoffset="['100','100','100','100']"
                    data-y="['top','top','top','top']"
                    data-voffset="['100','100','100','100']"
                    data-width="none"
                    data-height="none"
                    data-whitespace="nowrap"
                    data-type="column"
                    data-responsive_offset="on"
                    data-responsive="off"
                    data-frames='[{"delay":"+0","speed":300,"frame":"0","from":"opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"Power3.easeInOut"}]'
                    data-columnwidth="100%"
                    data-verticalalign="top"
                    data-textAlign="['center','center','center','center']"
                  >
                    <!-- start subtitle layer -->
                    <div
                      class="tp-caption mx-auto text-uppercase"
                      id="slide-${index + 1}-layer-06"
                      data-x="['center','center','center','center']"
                      data-hoffset="['0','0','0','0']"
                      data-y="['middle','middle','middle','middle']"
                      data-voffset="['0','0','0','0']"
                      data-fontsize="['13','13','13','13']"
                      data-lineheight="['20','20','20','20']"
                      data-fontweight="['500','500','500','500']"
                      data-letterspacing="['1','1','1','1']"
                      data-color="['#ffffff','#ffffff','#ffffff','#ffffff']"
                      data-width="['800','auto','auto','auto']"
                      data-height="auto"
                      data-whitespace="normal"
                      data-basealign="grid"
                      data-type="text"
                      data-responsive_offset="off"
                      data-verticalalign="middle"
                      data-responsive="off"
                      data-frames='[{"delay":2500,"speed":800,"frame":"0","from":"y:-50px;opacity:0;fb:20px;","to":"o:1;fb:0;","ease":"power3.inOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"power3.inOut"}]'
                      data-textAlign="['center','center','center','center']"
                      data-paddingtop="[0,0,0,0]"
                      data-paddingright="[0,0,0,0]"
                      data-paddingbottom="[25,25,10,10]"
                      data-paddingleft="[0,0,0,0]"
                      style="word-break: initial"
                    >
                      ${hs.subTitleOne}
                    </div>
                    <!-- end subtitle layer -->
                    <!-- start title layer -->
                    <div
                      class="tp-caption mx-auto"
                      id="slide-${index + 1}-layer-07"
                      data-x="['center','center','center','center']"
                      data-hoffset="['0','0','0','0']"
                      data-y="['middle','middle','middle','middle']"
                      data-voffset="['0','0','0','0']"
                      data-fontsize="['60','65','55','35']"
                      data-lineheight="['70','65','75','55']"
                      data-fontweight="['700','700','700','700']"
                      data-letterspacing="['-2','-2','-2','0']"
                      data-color="['#ffffff','#ffffff','#ffffff','#ffffff']"
                      data-width="['700','600','600','auto']"
                      data-height="auto"
                      data-whitespace="normal"
                      data-basealign="grid"
                      data-type="text"
                      data-responsive_offset="off"
                      data-verticalalign="middle"
                      data-responsive="on"
                      data-frames='[{"delay":"1500","split":"chars","splitdelay":0.03,"speed":800,"split_direction":"middletoedge","frame":"0","from":"x:50px;opacity:0;fb:10px;","to":"o:1;fb:0;","ease":"Power4.easeOut"},{"delay":"wait","speed":100,"frame":"999","to":"opacity:0;fb:0;","ease":"Power4.easeOut"}]'
                      data-textAlign="['center','center','center','center']"
                      data-paddingtop="[0,0,0,0]"
                      data-paddingright="[0,0,0,0]"
                      data-paddingbottom="[33,28,35,25]"
                      data-paddingleft="[0,0,0,0]"
                      style="
                        word-break: initial;
                        text-shadow: #0b1236 3px 3px 15px;
                      "
                    >
                      ${hs.mainTitle}
                    </div>
                    <!-- end title layer -->
                    <!-- start text layer -->
                    <div
                      class="tp-caption mx-auto text-uppercase"
                      id="slide-${index + 1}-layer-08"
                      data-x="['center','center','center','center']"
                      data-hoffset="['0','0','0','0']"
                      data-y="['middle','middle','middle','middle']"
                      data-voffset="['0','0','0','0']"
                      data-fontsize="['20','20','24','20']"
                      data-lineheight="['36','36','40','30']"
                      data-fontweight="['300','300','300','300']"
                      data-letterspacing="['0','0','0','0']"
                      data-color="['#ffffff','#ffffff','#ffffff','#ffffff']"
                      data-width="['500','500','auto','auto']"
                      data-height="auto"
                      data-whitespace="normal"
                      data-basealign="grid"
                      data-type="text"
                      data-responsive_offset="off"
                      data-verticalalign="middle"
                      data-responsive="on"
                      data-frames='[{"delay":2500,"speed":800,"frame":"0","from":"y:50px;opacity:0;fb:20px;","to":"o:0.6;fb:0;","ease":"power3.inOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"power3.inOut"}]'
                      data-textAlign="['center','center','center','center']"
                      data-paddingtop="[0,0,0,0]"
                      data-paddingright="[0,0,0,0]"
                      data-paddingbottom="[36,36,60,40]"
                      data-paddingleft="[0,0,0,0]"
                    >
                      ${hs.subTitleTwo}
                    </div>
                    <!-- end text layer -->
                    <!-- start button layer -->
                    <div
                      class="tp-caption tp-resizeme"
                      id="slide-${index + 1}-layer-09"
                      data-x="['center','center','center','center']"
                      data-hoffset="['0','0','0','0']"
                      data-y="['top','top','top','top']"
                      data-voffset="['0','0','0','0']"
                      data-width="auto"
                      data-height="none"
                      data-whitespace="nowrap"
                      data-fontsize="['18','16','16','16']"
                      data-lineheight="['70','55','55','55']"
                      data-type="text"
                      data-responsive_offset="off"
                      data-responsive="off"
                      data-frames='[{"delay":3000,"speed":1000,"frame":"0","from":"y:100px;opacity:0;","to":"o:1;","ease":"Power3.easeOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"Power3.easeInOut"}]'
                      data-textAlign="['inherit','inherit','inherit','inherit']"
                      data-paddingtop="[0,0,0,0]"
                      data-paddingright="[0,0,0,0]"
                      data-paddingbottom="[0,0,0,0]"
                      data-paddingleft="[0,0,0,0]"
                    >
                      <a
                        href="${hs.linkButton.url}"
                        class="btn btn-extra-large get-started-btn btn-rounded with-rounded btn-gradient-flamingo-amethyst-green btn-box-shadow"
                        >${
                          hs.linkButton.text
                        }<span class="bg-white text-base-color"
                          ><i class="fa-solid fa-arrow-right"></i></span
                      ></a>
                    </div>
                    <!-- end button layer -->
                  </div>
                  <!-- end column layer -->
                </div>
                <!-- end row layer -->
              </div>`
                  : ""
              }
              <!-- end row zone layer -->
            </li>
          `;
            });
            heroSlider.innerHTML = `<ul>${heroSliderContent}</ul>`;

            var tpj = jQuery;
            var revapi7;
            var $ = jQuery.noConflict();
            tpj(document).ready(function() {
                if (tpj("#demo-corporate-slider").revolution == undefined) {
                    revslider_showDoubleJqueryError("#demo-corporate-slider");
                } else {
                    revapi7 = tpj("#demo-corporate-slider")
                        .show()
                        .revolution({
                            sliderType: "standard",
                            /* sets the Slider's default timeline */
                            delay: 9000,
                            /* options are 'auto', 'fullwidth' or 'fullscreen' */
                            sliderLayout: "fullscreen",
                            /* RESPECT ASPECT RATIO */
                            autoHeight: "off",
                            /* options that disable autoplay */
                            stopLoop: "off",
                            stopAfterLoops: -1,
                            stopAtSlide: -1,
                            navigation: {
                                keyboardNavigation: "on",
                                keyboard_direction: "horizontal",
                                mouseScrollNavigation: "off",
                                mouseScrollReverse: "reverse",
                                onHoverStop: "off",
                                arrows: {
                                    enable: res.data.data.heroSection.length > 1,
                                    style: "hesperiden",
                                    rtl: false,
                                    hide_onleave: false,
                                    hide_onmobile: true,
                                    hide_under: 500,
                                    hide_over: 9999,
                                    hide_delay: 200,
                                    hide_delay_mobile: 1200,
                                    left: {
                                        container: "slider",
                                        h_align: "left",
                                        v_align: "center",
                                        h_offset: 50,
                                        v_offset: 0,
                                    },
                                    right: {
                                        container: "slider",
                                        h_align: "right",
                                        v_align: "center",
                                        h_offset: 50,
                                        v_offset: 0,
                                    },
                                },
                                bullets: {
                                    enable: true,
                                    style: "hermes",
                                    tmp: "",
                                    direction: "horizontal",
                                    rtl: false,

                                    container: "layergrid",
                                    h_align: "center",
                                    v_align: "bottom",
                                    h_offset: 0,
                                    v_offset: 30,
                                    space: 12,

                                    hide_onleave: false,
                                    hide_onmobile: true,
                                    hide_under: 0,
                                    hide_over: 500,
                                    hide_delay: true,
                                    hide_delay_mobile: 500,
                                },
                                touch: {
                                    touchenabled: "on",
                                    touchOnDesktop: "on",
                                    swipe_threshold: 75,
                                    swipe_min_touches: 1,
                                    swipe_direction: "horizontal",
                                    drag_block_vertical: true,
                                },
                            },
                            responsiveLevels: [1240, 1024, 768, 480],
                            visibilityLevels: [1240, 1024, 768, 480],
                            gridwidth: [1240, 1024, 768, 480],
                            gridheight: [930, 850, 900, 850],
                            lazyType: "smart",
                            spinner: "spinner0",
                            parallax: {
                                type: "scroll",
                                origo: "slidercenter",
                                speed: 400,
                                levels: [
                                    5, 10, 15, 20, 25, 30, 35, 40, 45, 46, 47, 48, 49, 50, 51, 5,
                                ],
                            },
                            shadow: 0,
                            shuffle: "off",
                            fullScreenAutoWidth: "on",
                            fullScreenAlignForce: "on",
                            fullScreenOffsetContainer: "nav",
                            fullScreenOffset: "",
                            hideThumbsOnMobile: "off",
                            hideSliderAtLimit: 0,
                            hideCaptionAtLimit: 0,
                            hideAllCaptionAtLilmit: 0,
                            debugMode: false,
                            fallbacks: {
                                simplifyAll: "off",
                                nextSlideOnWindowFocus: "off",
                                disableFocusListener: false,
                            },
                        });
                }
                const loaderOverlay = document.getElementById("loader-overlay");
                loaderOverlay.style.display = "none";
            });
        });

    await axios
        .get(apiUrl("homepage-about"), {
            params: {
                populate: {
                    image: {
                        fields: ["alternativeText", "url"],
                    },
                },
            },
        })
        .then((res) => {
            const response = res.data.data;

            const aboutUsTitle = document.getElementById("about-us-title");
            const aboutUsText = document.getElementById("about-us-text");
            const aboutUsImage = document.getElementById("about-us-image");

            aboutUsTitle.textContent = response.title;
            aboutUsText.textContent = response.text;
            aboutUsImage.src = imagePath(response.image.url);
            aboutUsImage.alt = response.image.alternativeText;
        });

    await axios.get(apiUrl("homepage-upcoming-event")).then((res) => {
        const upcomingEventsTitle = document.getElementById(
            "upcoming-events-title"
        );

        upcomingEventsTitle.textContent = res.data.data.title;
    });

    const upcomingEvents = document.getElementById("upcoming-events");

    await axios
        .get(apiUrl("upcoming-events"), {
            params: {
                populate: {
                    event: {
                        populate: {
                            image: {
                                fields: ["alternativeText", "url"],
                            },
                        },
                    },
                },
            },
        })
        .then((response) => {
            let upcomingEventsContent = "";

            const upcomingEventsInfo = document.getElementById(
                "upcoming-events-info"
            );

            upcomingEventsLength = response.data.data.length;

            if (upcomingEventsLength === 0) {
                upcomingEventsInfo.style.display = "block";
            } else {
                upcomingEventsInfo.style.display = "none";
            }

            response.data.data.forEach((ue) => {
                upcomingEventsContent += `<div class="swiper-slide">
                      <!-- start interactive banner item -->
                      <div
                        class="interactive-banner-style-09 border-radius-6px overflow-hidden position-relative"
                      >
                        <img
                          src="${imagePath(ue.event.image.url)}"
                          alt="${ue.event.image.alternativeText || ""}"
                        />
                        <div class="opacity-very-light bg-slate-blue"></div>
                        <div
                          class="image-content h-100 w-100 ps-15 pe-15 pt-13 pb-13 md-p-10 d-flex justify-content-bottom align-items-start flex-column"
                        >
                          <div
                            class="hover-label-icon position-relative z-index-9"
                          >
                            <div
                              class="label bg-base-color fw-600 text-white text-uppercase border-radius-30px ps-20px pe-20px fs-12 ls-05px"
                            >
                              ${ue.event.date ? formatDate(ue.event.date) : ""}
                            </div>
                          </div>
                          <div
                            class="mt-auto d-flex align-items-start w-100 z-index-1 position-relative overflow-hidden flex-column"
                          >
                            <span class="text-white fw-600 fs-20 ${
                              ue.event.subText ? "" : "mb-10"
                            }"
                              >${ue.event.mainText}</span
                            >
                            <span
                              class="content-title text-white fs-13 fw-500 ls-05px"
                              >${ue.event.subText || ""}</span
                            >
                            <a
                              href="upcoming-event.html?id=${ue.id}"
                              class="content-title-hover fs-13 lh-24 fw-500 ls-05px text-uppercase text-white opacity-6 text-decoration-line-bottom"
                              >Explore event</a
                            >
                            <span
                              class="content-arrow lh-42px rounded-circle bg-white w-50px h-50px ms-20px text-center"
                              ><i
                                class="fa-solid fa-chevron-right text-dark-gray fs-16"
                              ></i
                            ></span>
                          </div>
                          <div
                            class="position-absolute left-0px top-0px w-100 h-100 bg-gradient-regal-blue-transparent opacity-9"
                          ></div>
                          <div
                            class="box-overlay bg-gradient-base-color-transparent"
                          ></div>
                          <a
                            href="upcoming-event.html?id=${ue.id}"
                            class="position-absolute z-index-1 top-0px left-0px h-100 w-100"
                          ></a>
                        </div>
                      </div>
                      <!-- end interactive banner item -->
                    </div> `;
            });
            upcomingEvents.innerHTML =
                response.data.data.length > 3 ?
                upcomingEventsContent + upcomingEventsContent :
                upcomingEventsContent;
        })
        .catch(() => {});

    await axios.get(apiUrl("homepage-membership-perk")).then((res) => {
        const membershipPerksTitle = document.getElementById(
            "membership-perks-title"
        );

        membershipPerksTitle.textContent = res.data.data.title;
    });

    const membershipPerks = document.getElementById("membership-perks");

    await axios
        .get(apiUrl("membership-perks"), {
            params: {
                populate: {
                    image: {
                        fields: ["alternativeText", "url"],
                    },
                },
            },
        })
        .then((response) => {
            let membershipPerksContent = "";

            response.data.data.forEach((mp) => {
                membershipPerksContent += `<!-- start features box item -->
            <div class="col custom-icon-with-text-style-02">
              <div
                class="feature-box p-6 last-paragraph-no-margin overflow-hidden md-mb-20px"
              >
                <div class="feature-box-icon">
                  <img
                    class="custom-image-icon mb-20px"
                    src="${imagePath(mp.image.url)}"
                    alt="${mp.image.alternativeText}"
                  />
                </div>
                <div class="feature-box-content">
                  <span class="d-block fs-19 fw-700 text-blue mb-5px"
                    >${mp.perk}</span
                  >
                  <p>
                    ${mp.description ?? ""}
                  </p>
                </div>
              </div>
            </div>
            <!-- end features box item -->`;
            });
            membershipPerks.innerHTML = membershipPerksContent;
        })
        .catch(() => {});

    // await axios.get(apiUrl("homepage-article")).then((res) => {
    //   const articlesTitle = document.getElementById("articles-title");

    //   articlesTitle.textContent = res.data.data.title;
    // });

    // const articles = document.getElementById("articles");

    // await axios
    //   .get(apiUrl("articles"), {
    //     params: {
    //       populate: {
    //         image: {
    //           fields: ["alternativeText", "url"],
    //         },
    //       },
    //     },
    //   })
    //   .then((response) => {
    //     let articlesContent = "";

    //     response.data.data.slice(0, 3).forEach((article) => {
    //       articlesContent += `<div class="col-sm-6 col-lg-4 mt-4">
    //                     <div
    //                       class="border-radius-5px box-shadow-quadruple-large box-shadow-quadruple-large-hover h-100"
    //                     >
    //                       <div class="row">
    //                         <div class="col">
    //                           <a href="article.html?id=${
    //                             article.id
    //                           }" class="d-block"
    //                             ><img
    //                               src="${imagePath(article.image.url)}"
    //                               alt=""
    //                               class="w-100 border-radius-5px article-img"
    //                           /></a>
    //                         </div>
    //                       </div>
    //                       <div class="row mt-4 px-4">
    //                         <div class="col">
    //                           <a
    //                             href="article.html?id=${article.id}"
    //                             class="card-title mb-15px fw-700 fs-19 text-dark-gray lh-26 d-inline-block w-90 md-w-100"
    //                             >${article.title}</a
    //                           >
    //                           <p class="fs-16 lh-26">
    //                             ${article.description}
    //                           </p>
    //                         </div>
    //                       </div>
    //                       <div class="row px-4">
    //                         <div class="col">
    //                           <div
    //                             class="blog-date d-inline-block fw-500 fs-16 text-base-color"
    //                           >
    //                             ${formatDate(article.date)}
    //                           </div>
    //                         </div>
    //                       </div>
    //                       <div class="row px-4 pb-4">
    //                         <div class="col">
    //                           <div
    //                             class="d-inline-block author-name fw-500 fs-16 text-base-color"
    //                           >
    //                             By
    //                             <a
    //                               href="article.html?id=${article.id}"
    //                               class="text-base-color text-decoration-line-bottom"
    //                               >${article.author}</a
    //                             >
    //                           </div>
    //                         </div>
    //                       </div>
    //                     </div>
    //                   </div>`;
    //     });
    //     articles.innerHTML = articlesContent;
    //   })
    //   .catch(() => {});

    await axios.get(apiUrl("social-media-posts")).then((res) => {
        const response = res.data.data;
        const socialMediaPosts = document.getElementById("social-media-posts");

        let socialMediaPostsContent = "";

        const socialMediaInfo = document.getElementById("social-media-info");

        socialMediaPostsLength = response.length;

        if (socialMediaPostsLength === 0) {
            socialMediaInfo.style.display = "block";
        } else {
            socialMediaInfo.style.display = "none";
        }

        response.forEach((smp) => {
            socialMediaPostsContent += `<div class="swiper-slide">
              <div class="instagram-embed-container">
              <blockquote
                class="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink="${smp.instagramPostLink}"
                data-instgrm-version="14"
                style="width: 100%"
              >
                <div style="padding: 16px">
                  <a
                    href="${smp.instagramPostLink}"
                    style="
                      background: #ffffff;
                      line-height: 0;
                      padding: 0 0;
                      text-align: center;
                      text-decoration: none;
                      width: 100%;
                    "
                    target="_blank"
                  >
                    <div
                      style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                      "
                    >
                      <div
                        style="
                          background-color: #f4f4f4;
                          border-radius: 50%;
                          flex-grow: 0;
                          height: 40px;
                          margin-right: 14px;
                          width: 40px;
                        "
                      ></div>
                      <div
                        style="
                          display: flex;
                          flex-direction: column;
                          flex-grow: 1;
                          justify-content: center;
                        "
                      >
                        <div
                          style="
                            background-color: #f4f4f4;
                            border-radius: 4px;
                            flex-grow: 0;
                            height: 14px;
                            margin-bottom: 6px;
                            width: 100px;
                          "
                        ></div>
                        <div
                          style="
                            background-color: #f4f4f4;
                            border-radius: 4px;
                            flex-grow: 0;
                            height: 14px;
                            width: 60px;
                          "
                        ></div>
                      </div>
                    </div>
                    <div style="padding: 19% 0"></div>
                    <div
                      style="
                        display: block;
                        height: 50px;
                        margin: 0 auto 12px;
                        width: 50px;
                      "
                    >
                      <svg
                        width="50px"
                        height="50px"
                        viewBox="0 0 60 60"
                        version="1.1"
                        xmlns="https://www.w3.org/2000/svg"
                        xmlns:xlink="https://www.w3.org/1999/xlink"
                      >
                        <g
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            transform="translate(-511.000000, -20.000000)"
                            fill="#000000"
                          >
                            <g>
                              <path
                                d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div style="padding-top: 8px">
                      <div
                        style="
                          color: #3897f0;
                          font-family: Arial, sans-serif;
                          font-size: 14px;
                          font-style: normal;
                          font-weight: 550;
                          line-height: 18px;
                        "
                      >
                        View this post on Instagram
                      </div>
                    </div>
                    <div style="padding: 12.5% 0"></div>
                    <div
                      style="
                        display: flex;
                        flex-direction: row;
                        margin-bottom: 14px;
                        align-items: center;
                      "
                    >
                      <div>
                        <div
                          style="
                            background-color: #f4f4f4;
                            border-radius: 50%;
                            height: 12.5px;
                            width: 12.5px;
                            transform: translateX(0px) translateY(7px);
                          "
                        ></div>
                        <div
                          style="
                            background-color: #f4f4f4;
                            height: 12.5px;
                            transform: rotate(-45deg) translateX(3px)
                              translateY(1px);
                            width: 12.5px;
                            flex-grow: 0;
                            margin-right: 14px;
                            margin-left: 2px;
                          "
                        ></div>
                        <div
                          style="
                            background-color: #f4f4f4;
                            border-radius: 50%;
                            height: 12.5px;
                            width: 12.5px;
                            transform: translateX(9px) translateY(-18px);
                          "
                        ></div>
                      </div>
                      <div style="margin-left: 8px">
                        <div
                          style="
                            background-color: #f4f4f4;
                            border-radius: 50%;
                            flex-grow: 0;
                            height: 20px;
                            width: 20px;
                          "
                        ></div>
                        <div
                          style="
                            width: 0;
                            height: 0;
                            border-top: 2px solid transparent;
                            border-left: 6px solid #f4f4f4;
                            border-bottom: 2px solid transparent;
                            transform: translateX(16px) translateY(-4px)
                              rotate(30deg);
                          "
                        ></div>
                      </div>
                      <div style="margin-left: auto">
                        <div
                          style="
                            width: 0px;
                            border-top: 8px solid #f4f4f4;
                            border-right: 8px solid transparent;
                            transform: translateY(16px);
                          "
                        ></div>
                        <div
                          style="
                            background-color: #f4f4f4;
                            flex-grow: 0;
                            height: 12px;
                            width: 16px;
                            transform: translateY(-4px);
                          "
                        ></div>
                        <div
                          style="
                            width: 0;
                            height: 0;
                            border-top: 8px solid #f4f4f4;
                            border-left: 8px solid transparent;
                            transform: translateY(-4px) translateX(8px);
                          "
                        ></div>
                      </div>
                    </div>
                    <div
                      style="
                        display: flex;
                        flex-direction: column;
                        flex-grow: 1;
                        justify-content: center;
                        margin-bottom: 24px;
                      "
                    >
                      <div
                        style="
                          background-color: #f4f4f4;
                          border-radius: 4px;
                          flex-grow: 0;
                          height: 14px;
                          margin-bottom: 6px;
                          width: 224px;
                        "
                      ></div>
                      <div
                        style="
                          background-color: #f4f4f4;
                          border-radius: 4px;
                          flex-grow: 0;
                          height: 14px;
                          width: 144px;
                        "
                      ></div></div
                  ></a>
                  <p
                    style="
                      color: #c9c8cd;
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      line-height: 17px;
                      margin-bottom: 0;
                      margin-top: 8px;
                      overflow: hidden;
                      padding: 8px 0 7px;
                      text-align: center;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                  >
                    <a
                      href="${smp.instagramPostLink}"
                      style="
                        color: #c9c8cd;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: normal;
                        line-height: 17px;
                        text-decoration: none;
                      "
                      target="_blank"
                      ></a
                    >
                  </p>
                </div>
              </blockquote>
              </div>
            </div>`;
        });

        socialMediaPosts.innerHTML = socialMediaPostsContent;
        window.instgrm.Embeds.process();
    });

    await axios
        .get(apiUrl("become-an-ieee-member-banner"), {
            params: {
                populate: {
                    becomeAnIeeeMember: {
                        populate: {
                            image: {
                                fields: ["alternativeText", "url"],
                            },
                        },
                    },
                },
            },
        })
        .then((res) => {
            const response = res.data.data;

            const becomeAnIeeeMemberTitle = document.getElementById(
                "become-an-ieee-member-title"
            );

            becomeAnIeeeMemberTitle.textContent = response.becomeAnIeeeMember.title;

            const becomeAnIeeeMember = document.getElementById(
                "become-an-ieee-member"
            );

            becomeAnIeeeMember.style.backgroundImage = `url(${`${imagePath(
        response.becomeAnIeeeMember.image.url
      )}`})`;
        });

    await axios.get(apiUrl("become-an-ieee-member-link")).then((res) => {
        const becomeAMemberOne = document.getElementById("become-a-member-one");
        const becomeAMemberTwo = document.getElementById("become-a-member-two");

        becomeAMemberOne.href = becomeAMemberTwo.href = res.data.data.link;
    });

    showNextAndPreviousNavigationOfUpcomingEvents();
    showNextAndPreviousNavigationOfSocialMediaPosts();
    window.addEventListener("resize", () => {
        showNextAndPreviousNavigationOfUpcomingEvents();
        showNextAndPreviousNavigationOfSocialMediaPosts();
    });
});