/* BEGIN ANCHOR (WCAG_OPEN_DOOR_ACCESSIBILITY_LAB_APP_V1) */
(function () {
    "use strict";

    var STORAGE_KEY = "openDoorCpaccLabV1State";
    var GETTING_STARTED_KEY = "openDoorCpaccLabGettingStartedCollapsed";

    var state = {
        mode: "reinforce",
        questionStyle: "mode-default",
        levelFilter: "all",
        domain: "domain1",
        domains: ["domain1"],
        sessionQuestions: [],
        currentIndex: 0,
        selectedChoice: null,
        answered: false,
        sessionCorrect: 0,
        sessionIncorrect: 0,
        sprintActive: false,
        sprintStartedAt: 0,
        sprintEndsAt: 0,
        sprintTimerId: null,
        sprintMissedQuestions: [],
        missedQuestions: [],
        reviewIndex: 0,
        reviewingMissed: false,
        reviewChallenges: [],
        activeChallengeIndex: -1,
        modalOpen: false,
        lastResultsText: "",
        lastResultsStatus: "",
        lastSprintKeyAt: 0,
        recentQuestionIds: [],
        stats: makeEmptyStats()
    };

    var els = {};

    function makeEmptyStats() {
        return {
            totalAnswered: 0,
            correct: 0,
            incorrect: 0,
            currentStreak: 0,
            bestStreak: 0,
            domains: {
                domain1: { answered: 0, correct: 0, incorrect: 0 },
                domain2: { answered: 0, correct: 0, incorrect: 0 },
                domain3: { answered: 0, correct: 0, incorrect: 0 },
                domain4: { answered: 0, correct: 0, incorrect: 0 }
            }
        };
    }

    function onReady() {
        cacheElements();
        initGettingStartedDisclosure();
        loadState();
        updateSavedChallengesSummary();
        bindEvents();
        syncControlsFromState();
        updateLocationText();
        updateCounter();
        renderStatistics();
        updateModeDependentControls();
    }

    function initGettingStartedDisclosure() {
        if (!els.gettingStartedDetails || !els.gettingStartedSummary) {
            return;
        }

        if (window.localStorage && window.localStorage.getItem(GETTING_STARTED_KEY) === "true") {
            els.gettingStartedDetails.open = false;
        } else {
            els.gettingStartedDetails.open = true;
        }

        els.gettingStartedDetails.addEventListener("toggle", function () {
            if (window.localStorage) {
                window.localStorage.setItem(GETTING_STARTED_KEY, els.gettingStartedDetails.open ? "false" : "true");
            }
        });

        els.gettingStartedDetails.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && els.gettingStartedDetails.open) {
                event.preventDefault();
                els.gettingStartedDetails.open = false;
                if (window.localStorage) {
                    window.localStorage.setItem(GETTING_STARTED_KEY, "true");
                }
                focusElement(els.gettingStartedSummary);
                if (els.sprintAnnouncer) {
                    els.sprintAnnouncer.textContent = "";
                    window.setTimeout(function () {
                        els.sprintAnnouncer.textContent = "Getting Started and Keyboard Tips collapsed. Focus returned to the button.";
                    }, 60);
                }
            }
        });
    }

    function cacheElements() {
        els.main = document.getElementById("main");
        els.gettingStartedDetails = document.getElementById("getting-started-details");
        els.gettingStartedSummary = document.getElementById("getting-started-summary");
        els.setupPanel = document.getElementById("setup-panel");
        els.questionPanel = document.getElementById("question-panel");
        els.statisticsPanel = document.getElementById("statistics-panel");
        els.savedChallengesSummary = document.getElementById("saved-challenges-summary");
        els.startButton = document.getElementById("start-button");
        els.resumeButton = document.getElementById("resume-button");
        els.statisticsButton = document.getElementById("statistics-button");
        els.practiceLength = document.getElementById("practice-length");
        els.questionStyle = document.getElementById("question-style");
        els.levelFilter = document.getElementById("level-filter");
        els.difficultyFilter = document.getElementById("difficulty-filter");
        els.sprintLength = document.getElementById("sprint-length");
        els.questionHeading = document.getElementById("question-heading");
        els.locationText = document.getElementById("location-text");
        els.counter = document.getElementById("counter");
        els.questionText = document.getElementById("question-text");
        els.answersHeading = document.getElementById("answers-heading");
        els.choices = document.getElementById("choices");
        els.feedback = document.getElementById("feedback");
        els.advanceStatus = document.getElementById("advance-status");
        els.sprintAnnouncer = document.getElementById("sprint-announcer");
        els.nextQuestionButton = document.getElementById("next-question-button");
        els.skipButton = document.getElementById("skip-button");
        els.returnHomeButton = document.getElementById("return-home-button");
        els.reviewHeading = document.getElementById("review-heading");
        els.reviewContent = document.getElementById("review-content");
        els.reviewMissedButton = document.getElementById("review-missed-button");
        els.reviewChallengeStatus = document.getElementById("review-challenge-status");
        els.reviewChallengePanel = document.getElementById("review-challenge-panel");
        els.exportChallengesButton = document.getElementById("export-challenges-button");
        els.previousMissedButton = document.getElementById("previous-missed-button");
        els.nextMissedButton = document.getElementById("next-missed-button");
        els.returnResultsButton = document.getElementById("return-results-button");
        els.reviewStatisticsButton = document.getElementById("review-statistics-button");
        els.reviewCompleteSummary = document.getElementById("review-complete-summary");
        els.reviewCompleteActions = document.getElementById("review-complete-actions");
        els.reviewStartButton = document.getElementById("review-start-button");
        els.reviewOpenStatisticsButton = document.getElementById("review-open-statistics-button");
        els.reviewExportChallengesButton = document.getElementById("review-export-challenges-button");
        els.reviewClearChallengesButton = document.getElementById("review-clear-challenges-button");
        els.reviewReturnHomeButton = document.getElementById("review-return-home-button");
        els.challengeDialog = document.getElementById("challenge-dialog");
        els.challengeDialogHeading = document.getElementById("challenge-dialog-heading");
        els.challengeProposedAnswer = document.getElementById("challenge-proposed-answer");
        els.challengeReasoning = document.getElementById("challenge-reasoning");
        els.challengeDialogStatus = document.getElementById("challenge-dialog-status");
        els.challengeErrorMessage = document.getElementById("challenge-error-message");
        els.challengeSaveButton = document.getElementById("challenge-save-button");
        els.challengeCancelButton = document.getElementById("challenge-cancel-button");
        els.statisticsHeading = document.getElementById("statistics-heading");
        els.statisticsSummary = document.getElementById("statistics-summary");
        els.domainStatistics = document.getElementById("domain-statistics");
        els.resetStatisticsButton = document.getElementById("reset-statistics-button");
        els.statisticsHomeButton = document.getElementById("statistics-home-button");
    }

    function bindEvents() {
        els.startButton.addEventListener("click", startSession);
        els.resumeButton.addEventListener("click", resumeSession);
        els.statisticsButton.addEventListener("click", showStatistics);
        els.nextQuestionButton.addEventListener("click", nextQuestion);
        els.skipButton.addEventListener("click", skipQuestion);
        els.returnHomeButton.addEventListener("click", returnHome);
        if (els.reviewMissedButton) {
            els.reviewMissedButton.addEventListener("click", function () { showMissedReview(0); });
        }
        if (els.exportChallengesButton) {
            els.exportChallengesButton.addEventListener("click", exportChallenges);
        }
        if (els.previousMissedButton) {
            els.previousMissedButton.addEventListener("click", previousMissedQuestion);
        }
        if (els.nextMissedButton) {
            els.nextMissedButton.addEventListener("click", nextMissedQuestion);
        }
        if (els.returnResultsButton) {
            els.returnResultsButton.addEventListener("click", startSession);
        }
        if (els.reviewStatisticsButton) {
            els.reviewStatisticsButton.addEventListener("click", showStatistics);
        }
        if (els.reviewStartButton) {
            els.reviewStartButton.addEventListener("click", startSession);
        }
        if (els.reviewOpenStatisticsButton) {
            els.reviewOpenStatisticsButton.addEventListener("click", showStatistics);
        }
        if (els.reviewExportChallengesButton) {
            els.reviewExportChallengesButton.addEventListener("click", exportChallenges);
        }
        if (els.reviewClearChallengesButton) {
            els.reviewClearChallengesButton.addEventListener("click", clearSavedChallenges);
        }
        if (els.reviewReturnHomeButton) {
            els.reviewReturnHomeButton.addEventListener("click", returnHome);
        }
        if (els.challengeSaveButton) {
            els.challengeSaveButton.addEventListener("click", saveActiveChallenge);
        }
        if (els.challengeCancelButton) {
            els.challengeCancelButton.addEventListener("click", closeChallengeDialog);
        }
        if (els.challengeProposedAnswer) {
            els.challengeProposedAnswer.addEventListener("input", clearChallengeValidation);
        }
        if (els.challengeReasoning) {
            els.challengeReasoning.addEventListener("input", clearChallengeValidation);
        }
        els.resetStatisticsButton.addEventListener("click", resetStatistics);
        els.statisticsHomeButton.addEventListener("click", returnHome);
        document.addEventListener("focusin", keepFocusInChallengeModal, true);
        document.addEventListener("keydown", modalKeyboardCapture, true);
        document.addEventListener("keydown", handleKeyboard);
        els.practiceLength.addEventListener("change", saveState);
        if (els.questionStyle) {
            els.questionStyle.addEventListener("change", function () {
                state.questionStyle = els.questionStyle.value;
                saveState();
            });
        }
        if (els.levelFilter) {
            els.levelFilter.addEventListener("change", function () {
                state.levelFilter = els.levelFilter.value;
                saveState();
            });
        }
        els.difficultyFilter.addEventListener("change", saveState);
        if (els.sprintLength) {
            els.sprintLength.addEventListener("change", saveState);
        }

        getModeInputs().forEach(function (input) {
            input.addEventListener("change", function () {
                state.mode = input.value;
                updateLocationText();
                updateModeDependentControls();
                saveState();
            });
        });

        getDomainInputs().forEach(function (input) {
            input.addEventListener("change", function () {
                var selected = getSelectedDomains();
                if (!selected.length) {
                    input.checked = true;
                    selected = [input.value];
                    if (els.feedback) {
                        els.feedback.textContent = "At least one WCAG principle must remain selected.";
                    }
                }
                state.domains = selected;
                state.domain = selected[0];
                updateLocationText();
                saveState();
            });
        });
    }

    function getModeInputs() {
        return Array.prototype.slice.call(document.querySelectorAll("input[name='mode']"));
    }

    function getDomainInputs() {
        return Array.prototype.slice.call(document.querySelectorAll("input[name='domain']"));
    }

    function getSelectedDomains() {
        var selected = getDomainInputs().filter(function (input) {
            return input.checked;
        }).map(function (input) {
            return input.value;
        });
        return selected.length ? selected : ["domain1"];
    }

    function getSelectedDomainTitles() {
        return state.domains.map(function (domainId) {
            return getDomainTitle(domainId);
        });
    }

    function syncControlsFromState() {
        if (!Array.isArray(state.domains) || !state.domains.length) {
            state.domains = state.domain ? [state.domain] : ["domain1"];
        }
        getModeInputs().forEach(function (input) {
            input.checked = input.value === state.mode;
        });
        getDomainInputs().forEach(function (input) {
            input.checked = state.domains.indexOf(input.value) !== -1;
        });
        if (els.questionStyle) {
            els.questionStyle.value = state.questionStyle || "mode-default";
        }
        if (els.levelFilter) {
            els.levelFilter.value = state.levelFilter || "all";
        }
    }

    function getDomainTitle(domainId) {
        if (WCAG_LAB_DATA.domains[domainId]) {
            return WCAG_LAB_DATA.domains[domainId].title;
        }
        return "Domain not found";
    }

    function getModeLabel(mode) {
        if (mode === "practice") {
            return "Practice mode";
        }
        if (mode === "challenge") {
            return "Challenge mode";
        }
        if (mode === "sprint") {
            return "Sprint mode";
        }
        return "Reinforce mode";
    }

    function getLearnerQuestionText(question) {
        if (!question || !question.question) {
            return "";
        }
        return question.question.replace(/^Domain 1 reinforcement question \d+\.\s*/i, "");
    }

    function updateSavedChallengesSummary() {
        var count = state.reviewChallenges && state.reviewChallenges.length ? state.reviewChallenges.length : 0;
        var text = count ? "Saved Challenges: " + String(count) + " pending export." : "No saved challenges pending export.";

        if (els.savedChallengesSummary) {
            els.savedChallengesSummary.textContent = text;
        }
        if (els.reviewExportChallengesButton) {
            els.reviewExportChallengesButton.hidden = !count;
        }
        if (els.reviewClearChallengesButton) {
            els.reviewClearChallengesButton.hidden = !count;
        }
    }

    function setPanelHidden(panel, hidden) {
        if (!panel) {
            return;
        }
        panel.hidden = hidden;
        if (hidden) {
            panel.setAttribute("aria-hidden", "true");
        } else {
            panel.removeAttribute("aria-hidden");
        }
    }

    function updateModeDependentControls() {
        var isSprint = state.mode === "sprint";
        if (els.practiceLength) {
            els.practiceLength.disabled = isSprint;
            els.practiceLength.setAttribute("aria-disabled", isSprint ? "true" : "false");
        }
        if (els.sprintLength) {
            els.sprintLength.disabled = !isSprint;
            els.sprintLength.setAttribute("aria-disabled", isSprint ? "false" : "true");
        }
    }

    function updateLocationText() {
        var titles = getSelectedDomainTitles();
        var domainText = titles.length === 1 ? titles[0] : titles.join("; ");
        els.locationText.textContent = domainText + ". " + getModeLabel(state.mode) + ".";
    }

    function readSetupControls() {
        var checkedMode = document.querySelector("input[name='mode']:checked");
        var selectedDomains = getSelectedDomains();
        if (checkedMode) {
            state.mode = checkedMode.value;
        }
        if (els.questionStyle) {
            state.questionStyle = els.questionStyle.value;
        }
        if (els.levelFilter) {
            state.levelFilter = els.levelFilter.value;
        }
        state.domains = selectedDomains;
        state.domain = selectedDomains[0];
    }

    function getAvailableQuestions() {
        var difficulty = els.difficultyFilter ? els.difficultyFilter.value : "all";
        var levelFilter = state.levelFilter || "all";
        var questionStyle = state.questionStyle || "mode-default";
        var selectedDomains = Array.isArray(state.domains) && state.domains.length ? state.domains : [state.domain || "domain1"];
        var questions;

        if (questionStyle === "sc-to-definition") {
            questions = buildDefinitionChoiceQuestions();
        } else {
            questions = WCAG_LAB_DATA.questions.slice();
        }

        return questions.filter(function (question) {
            if (selectedDomains.indexOf(question.domain) === -1) {
                return false;
            }

            if (levelFilter !== "all" && question.level !== levelFilter) {
                return false;
            }

            if (questionStyle === "mode-default") {
                if (state.mode !== "sprint" && question.mode !== state.mode) {
                    return false;
                }
            } else if (questionStyle === "definition-to-sc") {
                if (question.questionType !== "Recall") {
                    return false;
                }
            } else if (questionStyle === "sc-to-definition") {
                if (question.questionType !== "Definition Recognition") {
                    return false;
                }
            } else if (questionStyle === "scenarios") {
                if (question.questionType === "Recall" || question.questionType === "Recognition" || question.questionType === "Definition Recognition") {
                    return false;
                }
            }

            if (difficulty === "all" || difficulty === "mixed") {
                return true;
            }
            return question.difficulty === difficulty;
        });
    }

    function getFullCriterionDefinition(criterion) {
        var definition;

        if (!criterion) {
            return "";
        }

        // Reverse-definition questions must use the complete WCAG criterion
        // text. shortDescription is intentionally abbreviated for many
        // criteria and can stop before required exceptions, conditions, or
        // list items (for example 3.3.6 Error Prevention (All)).
        definition = criterion.description || criterion.shortDescription || "";
        return String(definition)
            .replace(/\r\n/g, "\n")
            .split(/\n+/)
            .map(function (line) {
                return line.replace(/\s+/g, " ").trim();
            })
            .filter(function (line) {
                return Boolean(line);
            })
            .map(function (line) {
                if (line.length <= 60 && !/[.!?:;]$/.test(line)) {
                    return line + ":";
                }
                return line;
            })
            .join(" ")
            .trim();
    }

    function buildDefinitionChoiceQuestions() {
        var criteriaByNumber = {};
        var recallByNumber = {};

        (window.WCAG_DATA || []).forEach(function (criterion) {
            criteriaByNumber[criterion.scNumber] = criterion;
        });

        WCAG_LAB_DATA.questions.forEach(function (question) {
            if (question.questionType === "Recall" && !recallByNumber[question.scNumber]) {
                recallByNumber[question.scNumber] = question;
            }
        });

        return Object.keys(recallByNumber).map(function (scNumber) {
            var source = recallByNumber[scNumber];
            var criterion = criteriaByNumber[scNumber];
            var candidates;
            var distractors;
            var correctDefinition;

            if (!criterion) {
                return null;
            }

            correctDefinition = getFullCriterionDefinition(criterion);
            candidates = (window.WCAG_DATA || []).filter(function (item) {
                return item.scNumber !== scNumber && item.principle === criterion.principle;
            });
            if (candidates.length < 3) {
                candidates = (window.WCAG_DATA || []).filter(function (item) {
                    return item.scNumber !== scNumber;
                });
            }
            distractors = shuffle(candidates).slice(0, 3).map(function (item) {
                return getFullCriterionDefinition(item);
            });

            return {
                domain: source.domain,
                lesson: source.lesson,
                learningObjective: "Identify the definition of WCAG " + criterion.scNumber + " " + criterion.scName,
                level: criterion.level,
                principle: criterion.principle,
                guideline: criterion.guideline,
                scNumber: criterion.scNumber,
                scName: criterion.scName,
                id: "WCAG" + criterion.scNumber.replace(/\./g, "") + "DEF",
                difficulty: source.difficulty || "easy",
                mode: source.mode || "reinforce",
                question: "Which definition matches WCAG " + criterion.scNumber + " " + criterion.scName + "?",
                choices: [correctDefinition].concat(distractors),
                answer: 0,
                explanation: "WCAG " + criterion.scNumber + " " + criterion.scName + " requires: " + correctDefinition,
                questionType: "Definition Recognition"
            };
        }).filter(function (question) {
            return Boolean(question);
        });
    }

    function randomizeChoiceOrder(question) {
        var correctChoice;
        var choiceObjects;
        var shuffledChoices;
        var newAnswer = 0;
        var cloned;

        if (!question || !question.choices || typeof question.answer !== "number") {
            return question;
        }

        correctChoice = question.choices[question.answer];
        choiceObjects = question.choices.map(function (choice, index) {
            return {
                text: choice,
                originalIndex: index
            };
        });

        choiceObjects = shuffle(choiceObjects);
        shuffledChoices = choiceObjects.map(function (item, index) {
            if (item.originalIndex === question.answer) {
                newAnswer = index;
            }
            return item.text;
        });

        cloned = {};
        Object.keys(question).forEach(function (key) {
            cloned[key] = question[key];
        });
        cloned.choices = shuffledChoices;
        cloned.answer = newAnswer;
        cloned.originalAnswer = question.answer;
        cloned.originalChoices = question.choices.slice();

        if (correctChoice !== cloned.choices[cloned.answer]) {
            cloned.answer = cloned.choices.indexOf(correctChoice);
        }

        return cloned;
    }

    function chooseSessionQuestions(questions, requestedLength) {
        var shuffled = dedupeQuestions(shuffle(questions.slice()));
        var targetLength = requestedLength === "all" ? shuffled.length : Number(requestedLength);
        var recent = {};
        var preferred = [];
        var fallback = [];
        var selected;
        var maxRecent;

        state.recentQuestionIds.forEach(function (id) {
            recent[id] = true;
        });

        shuffled.forEach(function (question) {
            if (recent[question.id]) {
                fallback.push(question);
            } else {
                preferred.push(question);
            }
        });

        selected = preferred.concat(fallback);

        if (state.mode !== "sprint" && requestedLength !== "all") {
            selected = selected.slice(0, targetLength);
        }

        selected.forEach(function (question) {
            if (question && question.id) {
                state.recentQuestionIds.push(question.id);
            }
        });

        maxRecent = Math.max(50, Math.min(100, questions.length));
        if (state.recentQuestionIds.length > maxRecent) {
            state.recentQuestionIds = state.recentQuestionIds.slice(state.recentQuestionIds.length - maxRecent);
        }

        return selected.map(randomizeChoiceOrder);
    }

    function startSession() {
        if (els.reviewCompleteSummary) { els.reviewCompleteSummary.hidden = true; els.reviewCompleteSummary.innerHTML = ""; }

        if (els.challengeDialog) { els.challengeDialog.hidden = true; }
        state.modalOpen = false;

        if (els.challengeDialog) { els.challengeDialog.hidden = true; }

        if (els.reviewChallengePanel) { els.reviewChallengePanel.hidden = true; els.reviewChallengePanel.innerHTML = ""; }

        showNormalHomeButton();

        hideReviewCompleteActions();
        if (els.returnHomeButton) { els.returnHomeButton.hidden = false; }

        var domainInfo;
        stopSprintTimer();
        readSetupControls();
        updateLocationText();
        updateModeDependentControls();
        domainInfo = state.domains.filter(function (domainId) {
            return WCAG_LAB_DATA.domains[domainId] && WCAG_LAB_DATA.domains[domainId].comingSoon;
        });
        if (domainInfo.length) {
            els.feedback.textContent = getDomainTitle(domainInfo[0]) + " is coming soon. Please choose another WCAG principle.";
            focusElement(els.feedback);
            return;
        }

        var questions = getAvailableQuestions();
        if (!questions.length && els.difficultyFilter.value !== "all") {
            els.feedback.textContent = "No questions are available for the selected WCAG principles in " + getModeLabel(state.mode) + " with the selected difficulty. The Lab will use all difficulties for this session.";
            els.difficultyFilter.value = "all";
            questions = getAvailableQuestions();
        }
        if (!questions.length) {
            els.feedback.textContent = "No questions are available for the selected WCAG principles in " + getModeLabel(state.mode) + ".";
            focusElement(els.feedback);
            return;
        }

        var requestedLength = els.practiceLength.value;
        state.sessionQuestions = chooseSessionQuestions(questions, requestedLength);
        state.currentIndex = 0;
        state.sessionStartedAt = new Date().toLocaleString();
        state.selectedChoice = null;
        state.answered = false;
        state.sessionCorrect = 0;
        state.sessionIncorrect = 0;
        state.sprintActive = state.mode === "sprint";
        state.sprintMissedQuestions = [];
        state.missedQuestions = [];
        state.reviewIndex = 0;
        state.reviewingMissed = false;
        state.lastResultsText = "";
        state.lastResultsStatus = "";
        setReviewControls(false);

        if (state.mode === "sprint") {
            startSprintTimer();
        }

        showQuestion(true);
        saveState();
    }

    function resumeSession() {
        if (!state.sessionQuestions.length) {
            els.feedback.textContent = "No current session is available. Choose a domain and mode, then press Start Lab Session.";
            focusElement(els.feedback);
            return;
        }
        showQuestion();
    }

    function showQuestion(moveFocus) {
        var question = getCurrentQuestion();
        state.reviewingMissed = false;
        setReviewControls(false);
        if (!question) {
            completeSession();
            return;
        }

        document.title = "Question " + String(state.currentIndex + 1) + " - " + getModeLabel(state.mode).replace(" mode", "") + " - WCAG Accessibility Lab - Open Door Design";
        updateLocationText();
        updateCounter();
        els.feedback.textContent = "";
        setReviewChallengeStatus("");
        if (els.exportChallengesButton) { els.exportChallengesButton.hidden = true; }
        els.advanceStatus.textContent = "";
        setNextAvailable(false);
        if (state.mode === "sprint") {
            els.questionHeading.textContent = "Question " + String(state.currentIndex + 1) + ".";
            els.questionText.textContent = getLearnerQuestionText(question);
            els.answersHeading.textContent = "Answer Choices";
            renderChoices(question);
            els.nextQuestionButton.hidden = true;
            els.skipButton.hidden = true;
            // Sprint mode uses exactly one announcement channel per question
            // (announceSprintPrompt, via els.sprintAnnouncer below). advanceStatus
            // is intentionally left empty here rather than also announcing
            // "Sprint question X..." - a second, overlapping live region firing
            // the same information is what made repeated Sprint use noisy.
            els.advanceStatus.textContent = "";
            announceSprintPrompt(question);
            if (moveFocus !== false) {
                if (state.currentIndex === 0) {
                    focusElement(els.questionHeading);
                } else {
                    focusElement(els.questionText);
                }
            }
        } else {
            els.nextQuestionButton.hidden = false;
            els.skipButton.hidden = false;
            renderChoices(question);
            els.answersHeading.textContent = "Answer Choices";
            els.questionHeading.textContent = "Question " + String(state.currentIndex + 1) + " of " + String(state.sessionQuestions.length) + " - " + getModeLabel(state.mode).replace(" mode", "");
            els.questionText.textContent = getLearnerQuestionText(question);
            els.advanceStatus.textContent = "Question " + String(state.currentIndex + 1) + ". " + getLearnerQuestionText(question) + " Answer choices follow.";
            if (moveFocus !== false) {
                focusElement(els.questionText);
            }
        }
    }

    function buildSprintPrompt(question, includeInstructions) {
        var parts = [];
        if (includeInstructions) {
            parts.push("Sprint started. Press 1 through 4 to choose an answer, or use Tab and Enter.");
        }
        parts.push("Question " + String(state.currentIndex + 1) + ".");
        parts.push(getLearnerQuestionText(question));
        question.choices.forEach(function (choice, index) {
            parts.push(String(index + 1) + ". " + choice + ".");
        });
        return parts.join(" ");
    }

    function announceSprintPrompt(question) {
        // Instructions are announced once, on the first question of the Sprint
        // session, and never repeated afterward - every later question is
        // announced as just "Question X." followed by the question and choices,
        // with no re-stated "press 1 through 4" reminder.
        var includeInstructions = state.currentIndex === 0;
        var prompt = buildSprintPrompt(question, includeInstructions);
        if (!els.sprintAnnouncer) {
            return;
        }
        els.sprintAnnouncer.textContent = "";
        window.setTimeout(function () {
            if (state.mode === "sprint" && state.sprintActive && getCurrentQuestion() === question) {
                els.sprintAnnouncer.textContent = prompt;
            }
        }, 80);
    }

    function getCurrentQuestion() {
        if (!state.sessionQuestions.length) {
            return null;
        }
        return state.sessionQuestions[state.currentIndex] || null;
    }

    function renderChoices(question) {
        els.choices.innerHTML = "";
        question.choices.forEach(function (choice, index) {
            var li = document.createElement("li");
            var button = document.createElement("button");
            button.type = "button";
            button.className = "choice-button";
            button.textContent = String(index + 1) + ". " + choice;
            button.setAttribute("data-index", String(index));
            button.setAttribute("aria-label", "Answer " + String(index + 1) + ". " + choice);
            button.addEventListener("click", function () {
                selectChoice(index, button);
            });
            li.appendChild(button);
            els.choices.appendChild(li);
        });
    }

    function selectChoice(index, button) {
        var question = getCurrentQuestion();
        var correct;
        var resultText;

        if (!question || state.answered) {
            return;
        }

        if (state.mode === "sprint" && state.sprintActive) {
            if (Date.now() - state.lastSprintKeyAt < 250) {
                return;
            }
            state.lastSprintKeyAt = Date.now();
        }

        state.selectedChoice = index;
        correct = state.selectedChoice === question.answer;

        if (state.mode === "sprint") {
            if (!state.sprintActive || Date.now() >= state.sprintEndsAt) {
                completeSprint();
                return;
            }
            recordAnswer(correct, question);
            state.currentIndex += 1;
            state.selectedChoice = null;
            state.answered = false;
            if (state.currentIndex >= state.sessionQuestions.length || Date.now() >= state.sprintEndsAt) {
                completeSprint();
                return;
            }
            updateCounter();
            showQuestion(true);
            saveState();
            return;
        }

        state.answered = true;
        disableChoiceButtons();
        recordAnswer(correct, question);

        resultText = correct ? "Correct. " : "Incorrect. ";
        resultText += question.explanation;
        resultText += " Correct answer: " + question.choices[question.answer] + ".";
        els.feedback.textContent = resultText;
        els.advanceStatus.textContent = "Answer checked. Press C to continue, or activate Continue To Next Question.";
        setNextAvailable(true);
        updateCounter();
        renderStatistics();
        saveState();
        focusElement(els.nextQuestionButton);
    }

    function recordAnswer(correct, question) {
        if (correct) {
            state.sessionCorrect += 1;
            state.stats.correct += 1;
            state.stats.currentStreak += 1;
            if (state.stats.currentStreak > state.stats.bestStreak) {
                state.stats.bestStreak = state.stats.currentStreak;
            }
        } else {
            state.sessionIncorrect += 1;
            state.stats.incorrect += 1;
            state.stats.currentStreak = 0;
            if (question) {
                addMissedQuestion(question, state.selectedChoice);
            }
        }

        state.stats.totalAnswered += 1;
        updateDomainStats(correct, question);
    }

    function disableChoiceButtons() {
        var buttons = els.choices.querySelectorAll("button");
        buttons.forEach(function (button) {
            button.setAttribute("aria-disabled", "true");
        });
    }

    function updateDomainStats(correct, question) {
        var domainId = question && question.domain ? question.domain : state.domain;
        var domainStats = state.stats.domains[domainId];
        if (!domainStats) {
            state.stats.domains[domainId] = { answered: 0, correct: 0, incorrect: 0 };
            domainStats = state.stats.domains[domainId];
        }
        domainStats.answered += 1;
        if (correct) {
            domainStats.correct += 1;
        } else {
            domainStats.incorrect += 1;
        }
    }

    function nextQuestion() {
        if (state.mode === "sprint") {
            return;
        }
        if (!state.answered) {
            return;
        }
        state.currentIndex += 1;
        state.selectedChoice = null;
        state.answered = false;
        showQuestion();
        saveState();
    }

    function skipQuestion() {
        if (!state.sessionQuestions.length) {
            els.feedback.textContent = "No active session. Press Start Lab Session to begin.";
            focusElement(els.feedback);
            return;
        }
        state.currentIndex += 1;
        state.selectedChoice = null;
        state.answered = false;
        els.advanceStatus.textContent = "Question skipped.";
        showQuestion();
        saveState();
    }

    function completeSession() {
        stopSprintTimer();
        if (els.sprintAnnouncer) {
            els.sprintAnnouncer.textContent = "";
        }
        els.nextQuestionButton.hidden = false;
        els.skipButton.hidden = false;
        document.title = "Session Complete - WCAG Accessibility Lab - Open Door Design";
        els.questionHeading.textContent = "Session Complete";
        els.questionText.textContent = "Session complete.";
        els.choices.innerHTML = "";
        state.lastResultsText = "Session complete. You answered " + String(state.sessionCorrect) + " correct and " + String(state.sessionIncorrect) + " incorrect in this session.";
        state.lastResultsStatus = buildResultsStatus();
        // Results are announced once, as a single combined update on one live
        // region, rather than the results text and the next-step guidance
        // firing as two separate, overlapping announcements on two different
        // live regions at the same time - the same defect already fixed in
        // completeSprint() below, applied here to the far more common regular
        // (non-Sprint) session completion path, where it had been missed.
        els.feedback.textContent = state.lastResultsText + " " + state.lastResultsStatus;
        els.advanceStatus.textContent = "";
        setNextAvailable(false);
        hideQuizControls();
        if (els.returnResultsButton) {
            els.returnResultsButton.hidden = true;
            els.returnResultsButton.textContent = "Start New Session";
        }
        if (els.reviewStatisticsButton) {
            els.reviewStatisticsButton.hidden = true;
        }
        updateReviewButton();
        updateCounter();
        renderStatistics();
        saveState();
        // Move focus to a real, actionable control when one is available, and
        // never onto els.feedback itself: els.feedback is a role="status" live
        // region, and moving focus onto an element immediately after setting
        // its live-region text causes many screen readers to announce that
        // same text a second time - once as the live-region update, once again
        // as the newly-focused element's accessible content. Falling back to
        // the heading (a plain, non-live element) when there's nothing more
        // actionable to focus keeps that second, redundant read from happening
        // in every case, not only when a review button happens to be present.
        if (els.reviewMissedButton && !els.reviewMissedButton.hidden) {
            focusElement(els.reviewMissedButton);
        } else {
            focusElement(els.questionHeading);
        }
    }

    function updateCounter() {
        var total = state.sessionQuestions.length;
        var current = total ? Math.min(state.currentIndex + 1, total) : 0;
        if (state.mode === "sprint" && state.sprintActive) {
            els.counter.textContent = "Sprint mode. Time remaining: " + formatRemainingTime() + ". Questions completed: " + String(state.currentIndex) + ".";
            return;
        }
        els.counter.textContent = "Question " + String(current) + " of " + String(total) + ". Session score " + String(state.sessionCorrect) + " correct and " + String(state.sessionIncorrect) + " incorrect. Difficulty: " + getDifficultyLabel() + ".";
    }

    function getDifficultyLabel() {
        var value = els.difficultyFilter ? els.difficultyFilter.value : "all";
        if (value === "easy") {
            return "Easy";
        }
        if (value === "medium") {
            return "Medium";
        }
        if (value === "hard") {
            return "Hard";
        }
        return "All difficulties";
    }

    function setNextAvailable(available) {
        if (available) {
            els.nextQuestionButton.removeAttribute("aria-disabled");
            els.nextQuestionButton.textContent = "Continue To Next Question";
        } else {
            els.nextQuestionButton.setAttribute("aria-disabled", "true");
            els.nextQuestionButton.textContent = "Continue unavailable until answer is selected";
        }
    }

    function showStatistics() {
        if (els.reviewCompleteSummary) { els.reviewCompleteSummary.hidden = true; els.reviewCompleteSummary.innerHTML = ""; }

        if (els.challengeDialog) { els.challengeDialog.hidden = true; }
        state.modalOpen = false;

        if (els.challengeDialog) { els.challengeDialog.hidden = true; }

        if (els.reviewChallengePanel) { els.reviewChallengePanel.hidden = true; els.reviewChallengePanel.innerHTML = ""; }

        showNormalHomeButton();

        hideReviewCompleteActions();
        if (els.returnHomeButton) { els.returnHomeButton.hidden = false; }

        document.title = "Statistics - WCAG Accessibility Lab - Open Door Design";
        if (els.returnResultsButton) {
            els.returnResultsButton.hidden = true;
        }
        if (els.reviewStatisticsButton) {
            els.reviewStatisticsButton.hidden = true;
        }
        if (els.reviewMissedButton) { els.reviewMissedButton.hidden = true; }
        if (els.previousMissedButton) { els.previousMissedButton.hidden = true; }
        if (els.nextMissedButton) { els.nextMissedButton.hidden = true; }
        if (els.returnResultsButton) { els.returnResultsButton.hidden = true; }
        if (els.reviewStatisticsButton) { els.reviewStatisticsButton.hidden = true; }
        renderStatistics();
        focusElement(els.statisticsHeading);
    }

    function renderStatistics() {
        var accuracy = state.stats.totalAnswered ? Math.round((state.stats.correct / state.stats.totalAnswered) * 100) : 0;
        els.statisticsSummary.textContent = "Total questions answered: " + String(state.stats.totalAnswered) + ". Correct answers: " + String(state.stats.correct) + ". Incorrect answers: " + String(state.stats.incorrect) + ". Accuracy: " + String(accuracy) + " percent. Current streak: " + String(state.stats.currentStreak) + ". Best streak: " + String(state.stats.bestStreak) + ".";

        els.domainStatistics.innerHTML = "";
        Object.keys(WCAG_LAB_DATA.domains).forEach(function (domainId) {
            var domainStats = state.stats.domains[domainId] || { answered: 0, correct: 0, incorrect: 0 };
            var domainAccuracy = domainStats.answered ? Math.round((domainStats.correct / domainStats.answered) * 100) : 0;
            var li = document.createElement("li");
            li.textContent = getDomainTitle(domainId) + ". Answered: " + String(domainStats.answered) + ". Accuracy: " + String(domainAccuracy) + " percent.";
            els.domainStatistics.appendChild(li);
        });
    }

    function resetStatistics() {
        state.stats = makeEmptyStats();
        state.sessionCorrect = 0;
        state.sessionIncorrect = 0;
        renderStatistics();
        saveState();
        els.statisticsSummary.textContent = "Statistics reset. " + els.statisticsSummary.textContent;
        focusElement(els.statisticsHeading);
    }

    function returnHome() {
        if (els.reviewCompleteSummary) { els.reviewCompleteSummary.hidden = true; els.reviewCompleteSummary.innerHTML = ""; }

        if (els.challengeDialog) { els.challengeDialog.hidden = true; }
        state.modalOpen = false;

        if (els.challengeDialog) { els.challengeDialog.hidden = true; }

        if (els.reviewChallengePanel) { els.reviewChallengePanel.hidden = true; els.reviewChallengePanel.innerHTML = ""; }

        showNormalHomeButton();

        hideReviewCompleteActions();
        if (els.returnHomeButton) { els.returnHomeButton.hidden = false; }

        stopSprintTimer();
        if (els.sprintAnnouncer) {
            els.sprintAnnouncer.textContent = "";
        }
        els.nextQuestionButton.hidden = false;
        els.skipButton.hidden = false;
        setReviewControls(false);
        if (els.returnResultsButton) {
            els.returnResultsButton.hidden = true;
        }
        if (els.reviewStatisticsButton) {
            els.reviewStatisticsButton.hidden = true;
        }
        document.title = "WCAG Accessibility Lab - Open Door Design";
        els.questionHeading.textContent = "Question";
        els.feedback.textContent = "Returned to Lab Home.";
        updateLocationText();
        focusElement(document.getElementById("setup-heading"));
    }

    function startSprintTimer() {
        var seconds = Number(els.sprintLength ? els.sprintLength.value : 300);
        state.sprintActive = true;
        state.sprintStartedAt = Date.now();
        state.sprintEndsAt = Date.now() + (seconds * 1000);
        stopSprintTimer(false);
        state.sprintTimerId = window.setInterval(function () {
            updateCounter();
            if (Date.now() >= state.sprintEndsAt) {
                completeSprint();
            }
        }, 1000);
    }

    function stopSprintTimer(clearActive) {
        if (state.sprintTimerId) {
            window.clearInterval(state.sprintTimerId);
            state.sprintTimerId = null;
        }
        if (clearActive !== false) {
            state.sprintActive = false;
        }
    }

    function formatRemainingTime() {
        var remaining = Math.max(0, Math.ceil((state.sprintEndsAt - Date.now()) / 1000));
        var minutes = Math.floor(remaining / 60);
        var seconds = remaining % 60;
        return String(minutes) + " minutes " + String(seconds) + " seconds";
    }

    function completeSprint() {
        var answered = state.sessionCorrect + state.sessionIncorrect;
        var accuracy = answered ? Math.round((state.sessionCorrect / answered) * 100) : 0;
        stopSprintTimer();
        if (els.sprintAnnouncer) {
            els.sprintAnnouncer.textContent = "";
        }
        els.nextQuestionButton.hidden = false;
        els.skipButton.hidden = false;
        document.title = "Sprint Complete - WCAG Accessibility Lab - Open Door Design";
        els.questionHeading.textContent = "Sprint Complete";
        els.questionText.textContent = "Sprint complete.";
        state.currentIndex = state.sessionQuestions.length;
        updateLocationText();
        els.counter.textContent = "Questions completed: " + String(answered) + ".";
        els.choices.innerHTML = "";
        state.lastResultsText = "Sprint complete. Questions answered: " + String(answered) + ". Correct answers: " + String(state.sessionCorrect) + ". Incorrect answers: " + String(state.sessionIncorrect) + ". Accuracy: " + String(accuracy) + " percent.";
        state.lastResultsStatus = buildResultsStatus();
        // Results are announced once, as a single combined update on one live
        // region, rather than the results text and the next-step guidance
        // firing as two separate announcements.
        els.feedback.textContent = state.lastResultsText + " " + state.lastResultsStatus;
        els.advanceStatus.textContent = "";
        setNextAvailable(false);
        hideQuizControls();
        if (els.returnResultsButton) {
            els.returnResultsButton.hidden = true;
            els.returnResultsButton.textContent = "Start New Session";
        }
        if (els.reviewStatisticsButton) {
            els.reviewStatisticsButton.hidden = true;
        }
        updateReviewButton();
        renderStatistics();
        saveState();
        // Move focus directly to Review Missed Questions when it's available,
        // since that is the most likely next action after a Sprint; otherwise
        // fall back to the results announcement itself.
        if (els.reviewMissedButton && !els.reviewMissedButton.hidden) {
            focusElement(els.reviewMissedButton);
        } else {
            // Same reasoning as completeSession(): never fall back to
            // els.feedback itself, since focusing an element right after
            // setting its own live-region text announces that text twice.
            focusElement(els.questionHeading);
        }
    }


    function addMissedQuestion(question, selectedChoice) {
        var missed = {
            id: question.id,
            question: getLearnerQuestionText(question),
            choices: question.choices.slice(),
            answer: question.answer,
            selectedChoice: typeof selectedChoice === "number" ? selectedChoice : null,
            explanation: question.explanation || "Review the correct answer and compare it with the selected answer.",
            domain: question.domain || state.domain,
            mode: question.mode || state.mode
        };
        state.missedQuestions.push(missed);
        state.sprintMissedQuestions.push(question);
    }

    function buildResultsStatus() {
        if (state.missedQuestions.length) {
            return "Review Missed Questions is available.";
        }
        return "No missed questions in this session. Start New Session, Open Statistics, or Return Home are available.";
    }

    function updateReviewButton() {
        var show = Boolean(state.missedQuestions.length) && !state.reviewingMissed;
        if (els.reviewHeading) {
            els.reviewHeading.hidden = !show;
            els.reviewHeading.textContent = "Review Missed Questions";
        }
        if (!els.reviewMissedButton) {
            return;
        }
        els.reviewMissedButton.hidden = !show;
    }

    function showNormalHomeButton() {
        if (els.returnHomeButton) {
            els.returnHomeButton.hidden = false;
        }
    }

    function hideQuizControls() {
        if (els.nextQuestionButton) {
            els.nextQuestionButton.hidden = true;
        }
        if (els.skipButton) {
            els.skipButton.hidden = true;
        }
        if (els.reviewMissedButton) {
            els.reviewMissedButton.hidden = true;
        }
        if (els.previousMissedButton) {
            els.previousMissedButton.hidden = true;
        }
        if (els.nextMissedButton) {
            els.nextMissedButton.hidden = true;
        }
        if (els.returnResultsButton) {
            els.returnResultsButton.hidden = true;
        }
        if (els.reviewStatisticsButton) {
            els.reviewStatisticsButton.hidden = true;
        }
        if (els.returnHomeButton) {
            els.returnHomeButton.hidden = true;
        }
    }

    function hideReviewCompleteActions() {
        if (els.reviewCompleteActions) {
            els.reviewCompleteActions.hidden = true;
        }
        if (els.reviewExportChallengesButton) {
            els.reviewExportChallengesButton.hidden = true;
        }
    }

    function setReviewControls(active) {
        hideReviewCompleteActions();
        var atLast = state.reviewIndex >= state.missedQuestions.length - 1;
        if (els.reviewMissedButton) {
            els.reviewMissedButton.hidden = active || !state.missedQuestions.length;
        }
        if (els.reviewHeading) {
            els.reviewHeading.hidden = !active && !state.missedQuestions.length;
        }
        if (els.reviewContent) {
            els.reviewContent.hidden = !active;
        }
        if (els.previousMissedButton) {
            els.previousMissedButton.hidden = !active || state.reviewIndex <= 0;
            els.previousMissedButton.textContent = "Previous Missed Question";
        }
        if (els.nextMissedButton) {
            els.nextMissedButton.hidden = !active;
            els.nextMissedButton.textContent = atLast ? "Finish Review" : "Next Missed Question";
        }
        if (els.returnResultsButton) {
            els.returnResultsButton.hidden = active;
            els.returnResultsButton.textContent = "Start New Session";
        }
        if (els.reviewStatisticsButton) {
            els.reviewStatisticsButton.hidden = active;
        }
    }

    function renderChallengePanel(index) {
        if (!els.reviewChallengePanel) {
            return;
        }

        els.reviewChallengePanel.hidden = false;
        els.reviewChallengePanel.innerHTML = ""
            + "<button type=\"button\" id=\"challenge-button-" + String(index) + "\">Challenge This Answer</button>";

        window.setTimeout(function () {
            var button = document.getElementById("challenge-button-" + String(index));
            if (button) {
                button.onclick = function () {
                    openChallengeDialog(index, button);
                };
                button.addEventListener("keydown", function (event) {
                    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
                        event.preventDefault();
                        openChallengeDialog(index, button);
                    }
                });
            }
        }, 0);
    }

    function showMissedReview(index) {
        if (els.reviewCompleteSummary) { els.reviewCompleteSummary.hidden = true; els.reviewCompleteSummary.innerHTML = ""; }

        var missed;
        if (!state.missedQuestions.length) {
            els.advanceStatus.textContent = "There are no missed questions to review.";
            return;
        }
        state.reviewingMissed = true;
        state.reviewIndex = Math.max(0, Math.min(index, state.missedQuestions.length - 1));
        missed = state.missedQuestions[state.reviewIndex];
        document.title = "Review Missed Question - WCAG Accessibility Lab - Open Door Design";
        els.questionHeading.textContent = "Session Review";
        if (els.reviewHeading) {
            els.reviewHeading.hidden = false;
            els.reviewHeading.textContent = "Review Missed Questions - Question " + String(state.reviewIndex + 1) + " of " + String(state.missedQuestions.length);
        }
        els.locationText.textContent = "Missed question review.";
        els.counter.textContent = "Missed question " + String(state.reviewIndex + 1) + " of " + String(state.missedQuestions.length) + ".";
        els.questionText.textContent = "";
        els.choices.innerHTML = "";
        els.answersHeading.textContent = "Review Details";
        var reviewText = "Review Missed Questions. Question " + String(state.reviewIndex + 1) + " of " + String(state.missedQuestions.length) + ". "
            + "Question: " + missed.question + ". "
            + "Your answer: " + getChoiceText(missed, missed.selectedChoice) + ". "
            + "Correct answer: " + getChoiceText(missed, missed.answer) + ". "
            + "Why this matters: " + cleanSentence(missed.explanation) + ".";
        if (els.reviewContent) {
            els.reviewContent.innerHTML = ""
                + "<p><strong>Question:</strong> " + escapeHtml(missed.question) + "</p>"
                + "<p><strong>Your answer:</strong> " + escapeHtml(getChoiceText(missed, missed.selectedChoice)) + "</p>"
                + "<p><strong>Correct answer:</strong> " + escapeHtml(getChoiceText(missed, missed.answer)) + "</p>"
                + "<p><strong>Why this matters:</strong> " + escapeHtml(cleanSentence(missed.explanation)) + "</p>"
                ;
            els.reviewContent.setAttribute("aria-label", reviewText);

        }
        els.feedback.textContent = "";
        els.advanceStatus.textContent = "";
        els.nextQuestionButton.hidden = true;
        els.skipButton.hidden = true;
        setReviewControls(true);
        renderChallengePanel(state.reviewIndex);
        focusElement(els.reviewHeading || els.reviewContent || els.questionHeading);
        announceReviewItem(reviewText);
        saveState();
    }

    function announceReviewItem(text) {
        if (!els.sprintAnnouncer) {
            return;
        }
        els.sprintAnnouncer.textContent = "";
        window.setTimeout(function () {
            els.sprintAnnouncer.textContent = text;
        }, 60);
    }

    function cleanSentence(value) {
        return String(value || "").replace(/[.\s]+$/g, "");
    }

    function collapseChallengeDetailsOnEscape(details, summary) {
        details.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && details.open) {
                event.preventDefault();
                details.open = false;
                var target = els.nextMissedButton && !els.nextMissedButton.hidden ? els.nextMissedButton : null;
                focusElement(target || summary);
                setReviewChallengeStatus("Challenge This Answer collapsed.");
            }
        });
    }

    function challengeModalIsOpen() {
        return !!(state.modalOpen && els.challengeDialog && !els.challengeDialog.hidden);
    }

    function eventIsInsideChallengeModal(event) {
        return !!(event.target && event.target.closest && event.target.closest("#challenge-dialog"));
    }

    function keepFocusInChallengeModal(event) {
        if (!challengeModalIsOpen()) {
            return;
        }
        if (!eventIsInsideChallengeModal(event)) {
            focusElement(els.challengeDialogHeading || els.challengeProposedAnswer);
        }
    }

    function modalKeyboardCapture(event) {
        var tagName;
        var isButton;
        var isActivationKey;

        if (!challengeModalIsOpen()) {
            return;
        }

        if (event.key === "Tab") {
            trapChallengeFocus(event);
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            }
            closeChallengeDialog();
            return;
        }

        if (!eventIsInsideChallengeModal(event)) {
            event.preventDefault();
            event.stopPropagation();
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            }
            focusElement(els.challengeDialogHeading || els.challengeProposedAnswer);
            return;
        }

        tagName = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
        isButton = tagName === "button";
        isActivationKey = event.key === "Enter" || event.key === " " || event.key === "Spacebar";

        if (isButton && isActivationKey) {
            event.preventDefault();
            event.stopPropagation();
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            }
            event.target.click();
            return;
        }

        if (isTextEntryControl(event.target)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
        }
    }

    function guardChallengeModalEvent(event) {
        var tagName;
        var isButton;
        var isActivationKey;

        if (!challengeModalIsOpen()) {
            return false;
        }

        if (event.key === "Tab" || event.key === "Escape") {
            return false;
        }

        tagName = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
        isButton = tagName === "button";
        isActivationKey = event.key === "Enter" || event.key === " " || event.key === "Spacebar";

        if (eventIsInsideChallengeModal(event) && (isTextEntryControl(event.target) || (isButton && isActivationKey))) {
            return false;
        }

        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
        }
        return true;
    }

    function getChallengeReturnTarget() {
        if (els.nextMissedButton && !els.nextMissedButton.hidden) {
            return els.nextMissedButton;
        }
        return state.challengeReturnButton || null;
    }

    function closeChallengeDialogAndContinue(message) {
        var target = getChallengeReturnTarget();
        if (els.challengeDialog) {
            els.challengeDialog.hidden = true;
        }
        state.modalOpen = false;
        state.activeChallengeIndex = -1;
        if (message) {
            setReviewChallengeStatus(message);
        }
        window.setTimeout(function () {
            focusElement(target);
        }, 80);
    }

    function getDialogFocusableElements() {
        if (!els.challengeDialog || els.challengeDialog.hidden) {
            return [];
        }
        return Array.prototype.slice.call(els.challengeDialog.querySelectorAll("input, textarea, button"))
            .filter(function (element) {
                return !element.disabled && !element.hidden;
            });
    }

    function trapChallengeFocus(event) {
        var focusable;
        var first;
        var last;
        if (!els.challengeDialog || els.challengeDialog.hidden || event.key !== "Tab") {
            return;
        }
        focusable = getDialogFocusableElements();
        if (!focusable.length) {
            return;
        }
        first = focusable[0];
        last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function clearChallengeValidation() {
        if (els.challengeErrorMessage) {
            els.challengeErrorMessage.hidden = true;
            els.challengeErrorMessage.textContent = "";
        }
        if (els.challengeProposedAnswer) {
            els.challengeProposedAnswer.removeAttribute("aria-invalid");
            els.challengeProposedAnswer.removeAttribute("aria-describedby");
        }
        if (els.challengeReasoning) {
            els.challengeReasoning.removeAttribute("aria-invalid");
            els.challengeReasoning.removeAttribute("aria-describedby");
        }
    }

    function openChallengeDialog(index, returnButton) {
        var missed = state.missedQuestions[index];
        state.activeChallengeIndex = index;
        state.challengeReturnButton = returnButton || null;
        state.modalOpen = true;

        if (els.challengeDialogHeading) {
            els.challengeDialogHeading.textContent = "Challenge Review - Question " + String(index + 1) + " of " + String(state.missedQuestions.length);
        }

        if (els.challengeProposedAnswer) {
            els.challengeProposedAnswer.value = "";
            els.challengeProposedAnswer.removeAttribute("aria-invalid");
            els.challengeProposedAnswer.removeAttribute("aria-describedby");
        }
        if (els.challengeReasoning) {
            els.challengeReasoning.value = "";
            els.challengeReasoning.removeAttribute("aria-invalid");
            els.challengeReasoning.removeAttribute("aria-describedby");
        }
        if (els.challengeErrorMessage) {
            els.challengeErrorMessage.hidden = true;
            els.challengeErrorMessage.textContent = "";
        }
        if (els.challengeDialogStatus) {
            els.challengeDialogStatus.textContent = missed
                ? "Question: " + missed.question + ". Your answer: " + getChoiceText(missed, missed.selectedChoice) + ". Current app answer: " + getChoiceText(missed, missed.answer) + "."
                : "";
        }

        if (els.challengeDialog) {
            els.challengeDialog.hidden = false;
        }

    }

    function closeChallengeDialog() {
        closeChallengeDialogAndContinue("Challenge cancelled. Continue reviewing missed questions.");
    }

    function saveActiveChallenge() {
        var index = state.activeChallengeIndex;
        var missed = state.missedQuestions[index];
        var proposed = els.challengeProposedAnswer ? els.challengeProposedAnswer.value.trim() : "";
        var reasoning = els.challengeReasoning ? els.challengeReasoning.value.trim() : "";
        var saved;

        if (!missed) {
            if (els.challengeErrorMessage) {
                els.challengeErrorMessage.hidden = false;
                els.challengeErrorMessage.textContent = "Challenge could not be saved because the review question was not found.";
            }
            focusElement(els.challengeDialogHeading || els.challengeProposedAnswer);
            return;
        }

        if (!proposed && !reasoning) {
            if (els.challengeErrorMessage) {
                els.challengeErrorMessage.hidden = false;
                els.challengeErrorMessage.textContent = "Enter a proposed answer or reasoning before saving the challenge.";
            }
            if (els.challengeProposedAnswer) {
                els.challengeProposedAnswer.setAttribute("aria-invalid", "true");
                els.challengeProposedAnswer.setAttribute("aria-describedby", "challenge-error-message");
            }
            if (els.challengeReasoning) {
                els.challengeReasoning.setAttribute("aria-invalid", "true");
                els.challengeReasoning.setAttribute("aria-describedby", "challenge-error-message");
            }
            focusElement(els.challengeProposedAnswer || els.challengeReasoning);
            return;
        }

        saved = {
            domain: getDomainTitle(missed.domain || state.domain),
            mode: missed.mode || state.mode,
            question: missed.question,
            yourAnswer: getChoiceText(missed, missed.selectedChoice),
            correctAnswer: getChoiceText(missed, missed.answer),
            proposedAnswer: proposed,
            reasoning: reasoning,
            createdAt: new Date().toLocaleString(),
            sessionStartedAt: state.sessionStartedAt || "",
            reviewQuestionNumber: String(index + 1) + " of " + String(state.missedQuestions.length)
        };

        state.reviewChallenges.push(saved);
        if (els.reviewExportChallengesButton) {
            els.reviewExportChallengesButton.hidden = false;
        }
        saveState();
        updateSavedChallengesSummary();
        closeChallengeDialogAndContinue("Challenge saved. Continue reviewing missed questions.");
    }

    function setReviewChallengeStatus(message) {
        if (els.reviewChallengeStatus) {
            els.reviewChallengeStatus.textContent = message;
        }
    }

    function saveChallenge(index) {
        setReviewChallengeStatus("Challenge saving is temporarily unavailable while this feature is being rebuilt.");
    }

    function clearSavedChallenges() {
        var count = state.reviewChallenges && state.reviewChallenges.length ? state.reviewChallenges.length : 0;
        if (!count) {
            setReviewChallengeStatus("No saved challenges to clear.");
            updateSavedChallengesSummary();
            return;
        }

        if (!window.confirm("Clear " + String(count) + " saved challenges? This action cannot be undone.")) {
            setReviewChallengeStatus("Clear saved challenges cancelled.");
            return;
        }

        state.reviewChallenges = [];
        saveState();
        updateSavedChallengesSummary();
        setReviewChallengeStatus("Saved challenges cleared.");
    }

    function exportChallenges() {
        var lines = [];
        var blob;
        var link;
        var dateStamp = new Date().toISOString().slice(0, 10);
        var domains = {};
        var sessions = {};

        if (!state.reviewChallenges || !state.reviewChallenges.length) {
            setReviewChallengeStatus("No saved challenges are available to export.");
            return;
        }

        state.reviewChallenges.forEach(function (item) {
            if (item.domain) {
                domains[item.domain] = true;
            }
            if (item.sessionStartedAt) {
                sessions[item.sessionStartedAt] = true;
            }
        });

        lines.push("WCAG Accessibility Lab - Open Door Design");
        lines.push("Saved Challenge Review Export");
        lines.push("");
        lines.push("Export date: " + new Date().toLocaleString());
        lines.push("Total saved challenges: " + String(state.reviewChallenges.length));
        lines.push("Domains represented: " + Object.keys(domains).join("; "));
        lines.push("Sessions included: " + Object.keys(sessions).length);
        lines.push("");

        state.reviewChallenges.forEach(function (item, index) {
            lines.push("Challenge " + String(index + 1));
            lines.push("Date saved: " + (item.createdAt || ""));
            lines.push("Session: " + (item.sessionStartedAt || ""));
            lines.push("Review question: " + (item.reviewQuestionNumber || ""));
            lines.push("Domain: " + (item.domain || ""));
            lines.push("Mode: " + (item.mode || ""));
            lines.push("Question: " + (item.question || ""));
            lines.push("Your answer: " + (item.yourAnswer || ""));
            lines.push("Current app answer: " + (item.correctAnswer || ""));
            lines.push("Proposed answer: " + (item.proposedAnswer || ""));
            lines.push("Reasoning for instructor review: " + (item.reasoning || ""));
            lines.push("");
            lines.push("----------------------------------------");
            lines.push("");
        });

        blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
        link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "WCAG-OpenDoorAccessibilityLab-Challenges-" + dateStamp + ".txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        setReviewChallengeStatus("Saved challenges exported. " + String(state.reviewChallenges.length) + " challenges are still pending until cleared.");
        updateSavedChallengesSummary();
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function getChoiceText(missed, index) {
        if (typeof index !== "number" || !missed.choices[index]) {
            return "No answer recorded";
        }
        return missed.choices[index];
    }

    function getReviewStatus() {
        var parts = [];
        if (state.reviewIndex > 0) {
            parts.push("Previous Missed Question is available.");
        }
        if (state.reviewIndex < state.missedQuestions.length - 1) {
            parts.push("Next Missed Question is available.");
        }
        parts.push("Start New Session is available.");
        return parts.join(" ");
    }

    function previousMissedQuestion() {
        if (state.reviewIndex > 0) {
            showMissedReview(state.reviewIndex - 1);
        }
    }

    function nextMissedQuestion() {
        if (state.reviewIndex < state.missedQuestions.length - 1) {
            showMissedReview(state.reviewIndex + 1);
        } else {
            showReviewComplete();
        }
    }

    function hideReviewNavigationControls() {
        if (els.previousMissedButton) { els.previousMissedButton.hidden = true; }
        if (els.nextMissedButton) { els.nextMissedButton.hidden = true; }
        if (els.reviewChallengePanel) {
            els.reviewChallengePanel.hidden = true;
            els.reviewChallengePanel.innerHTML = "";
        }
    }

    function showReviewComplete() {
        var correct = state.correctCount || 0;
        var total = state.sessionQuestions && state.sessionQuestions.length ? state.sessionQuestions.length : 0;
        var reviewed = state.missedQuestions && state.missedQuestions.length ? state.missedQuestions.length : 0;

        updateSavedChallengesSummary();
        hideReviewNavigationControls();

        document.title = "Review Complete - WCAG Accessibility Lab - Open Door Design";

        if (els.reviewHeading) {
            els.reviewHeading.hidden = true;
            els.reviewHeading.textContent = "Review Missed Questions";
        }
        if (els.reviewContent) {
            els.reviewContent.hidden = true;
            els.reviewContent.innerHTML = "";
            els.reviewContent.removeAttribute("aria-label");
        }
        if (els.questionHeading) {
            els.questionHeading.textContent = "Review Complete";
            els.questionHeading.hidden = false;
        }
        if (els.questionText) {
            els.questionText.textContent = "You have finished reviewing all missed questions.";
        }
        if (els.locationText) {
            els.locationText.textContent = "Review complete.";
        }
        if (els.counter) {
            els.counter.textContent = "You answered " + String(correct) + " of " + String(total) + " questions correctly. You reviewed " + String(reviewed) + " missed questions. Focus is on Start New Session.";
        }
        if (els.reviewCompleteSummary) {
            els.reviewCompleteSummary.hidden = false;
            els.reviewCompleteSummary.innerHTML = ""
                + "<p>You have finished reviewing all missed questions.</p>"
                + "<p>You answered " + String(correct) + " of " + String(total) + " questions correctly.</p>"
                + "<p>You reviewed " + String(reviewed) + " missed questions.</p>"
                + "<p>Focus is on Start New Session.</p>";
        }
        if (els.feedback) {
            els.feedback.textContent = "";
        }
        if (els.advanceStatus) {
            els.advanceStatus.textContent = "Review complete. You have finished reviewing all missed questions. You answered " + String(correct) + " of " + String(total) + " questions correctly. You reviewed " + String(reviewed) + " missed questions. Focus is on Start New Session.";
        }

        hideQuizControls();

        if (els.reviewCompleteActions) {
            els.reviewCompleteActions.hidden = false;
        }
        if (els.reviewExportChallengesButton) {
            els.reviewExportChallengesButton.hidden = !(state.reviewChallenges && state.reviewChallenges.length);
        }
        if (els.reviewClearChallengesButton) {
            els.reviewClearChallengesButton.hidden = !(state.reviewChallenges && state.reviewChallenges.length);
        }

        state.reviewingMissed = false;
        saveState();

        window.setTimeout(function () {
            focusElement(els.reviewStartButton || els.returnResultsButton);
        }, 60);
    }


    function showStoredResults() {
        if (els.reviewCompleteSummary) { els.reviewCompleteSummary.hidden = true; els.reviewCompleteSummary.innerHTML = ""; }

        if (els.challengeDialog) { els.challengeDialog.hidden = true; }
        state.modalOpen = false;

        if (els.challengeDialog) { els.challengeDialog.hidden = true; }

        if (els.reviewChallengePanel) { els.reviewChallengePanel.hidden = true; els.reviewChallengePanel.innerHTML = ""; }

        showNormalHomeButton();

        hideReviewCompleteActions();
        if (els.returnHomeButton) { els.returnHomeButton.hidden = false; }

        state.reviewingMissed = false;
        document.title = "Session Complete - WCAG Accessibility Lab - Open Door Design";
        els.questionHeading.textContent = state.mode === "sprint" ? "Sprint Complete" : "Session Complete";
        updateLocationText();
        els.questionText.textContent = "Session complete.";
        els.choices.innerHTML = "";
        // Same consolidation as completeSession() and completeSprint(): one
        // combined message on the one live region, not two separate live
        // regions firing overlapping text at the same time.
        els.feedback.textContent = (state.lastResultsText || "Session complete.") + " " + (state.lastResultsStatus || buildResultsStatus());
        els.advanceStatus.textContent = "";
        els.nextQuestionButton.hidden = false;
        els.skipButton.hidden = false;
        setNextAvailable(false);
        hideQuizControls();
        if (els.returnResultsButton) {
            els.returnResultsButton.hidden = true;
            els.returnResultsButton.textContent = "Start New Session";
        }
        if (els.reviewStatisticsButton) {
            els.reviewStatisticsButton.hidden = true;
        }
        updateReviewButton();
        if (state.missedQuestions.length && els.reviewHeading) {
            focusElement(els.reviewHeading);
        } else {
            // Never fall back to els.feedback itself - see the comment in
            // completeSession() for why focusing a live region right after
            // setting its text causes a duplicate announcement.
            focusElement(els.questionHeading);
        }
        saveState();
    }

    function announceQuestion() {
        var question = getCurrentQuestion();
        if (!question) {
            els.advanceStatus.textContent = "No active question. Press S to start a session.";
            return;
        }
        if (state.mode === "sprint") {
            if (els.sprintAnnouncer) {
                els.sprintAnnouncer.textContent = "";
                window.setTimeout(function () {
                    els.sprintAnnouncer.textContent = buildSprintPrompt(question);
                }, 60);
            }
            return;
        }
        els.advanceStatus.textContent = "Question. " + getLearnerQuestionText(question);
    }

    function announceRemainingTime() {
        if (state.mode === "sprint" && state.sprintActive) {
            if (els.sprintAnnouncer) {
                els.sprintAnnouncer.textContent = "";
                window.setTimeout(function () {
                    els.sprintAnnouncer.textContent = formatRemainingTime() + " remaining.";
                }, 60);
            }
            return;
        }
        els.advanceStatus.textContent = "Remaining time is only available during Sprint mode.";
    }

    function announceAnswers() {
        var question = getCurrentQuestion();
        var messages = [];
        if (!question) {
            els.advanceStatus.textContent = "No answer choices are available yet.";
            return;
        }
        question.choices.forEach(function (choice, index) {
            messages.push("Answer " + String(index + 1) + ". " + choice + ".");
        });
        els.advanceStatus.textContent = messages.join(" ");
    }

    function handleKeyboard(event) {
        var key = event.key.toLowerCase();

        if (guardChallengeModalEvent(event)) {
            return;
        }

        if (isTextEntryControl(event.target)) {
            return;
        }

        if (key >= "1" && key <= "4") {
            var index = Number(key) - 1;
            var buttons = els.choices.querySelectorAll("button");
            if (state.mode === "sprint" && state.sprintActive) {
                event.preventDefault();
                selectChoice(index, null);
            } else if (buttons[index]) {
                event.preventDefault();
                buttons[index].click();
            }
        } else if (key === "s") {
            event.preventDefault();
            startSession();
        } else if (key === "t") {
            event.preventDefault();
            setModeFromShortcut("sprint");
        } else if (key === "p") {
            event.preventDefault();
            setModeFromShortcut("practice");
        } else if (key === "c") {
            if (!els.nextQuestionButton.getAttribute("aria-disabled")) {
                event.preventDefault();
                nextQuestion();
            } else if (!state.sessionQuestions.length) {
                event.preventDefault();
                setModeFromShortcut("challenge");
            }
        } else if (key === "m") {
            if (state.missedQuestions.length && !state.sprintActive) {
                event.preventDefault();
                showMissedReview(0);
            }
        } else if (key === "q") {
            event.preventDefault();
            announceQuestion();
        } else if (key === "r") {
            event.preventDefault();
            announceRemainingTime();
        } else if (key === "escape") {
            if (state.reviewingMissed) {
                event.preventDefault();
                showStoredResults();
            } else if (state.mode === "sprint" && state.sprintActive) {
                event.preventDefault();
                completeSprint();
            }
        } else if (key === "a") {
            event.preventDefault();
            announceAnswers();
        } else if (key === "n") {
            event.preventDefault();
            skipQuestion();
        } else if (key === "h") {
            event.preventDefault();
            returnHome();
        }
    }

    function setModeFromShortcut(mode) {
        var input = document.querySelector("input[name='mode'][value='" + mode + "']");
        if (!input) {
            return;
        }
        input.checked = true;
        state.mode = mode;
        updateLocationText();
        updateModeDependentControls();
        saveState();
        els.feedback.textContent = getModeLabel(mode) + " selected.";
    }

    function isTextEntryControl(element) {
        var tagName = element.tagName ? element.tagName.toLowerCase() : "";
        return tagName === "input" || tagName === "select" || tagName === "textarea";
    }

    function focusElement(element) {
        if (!element) {
            return;
        }
        if (!element.hasAttribute("tabindex") && !isNaturallyFocusable(element)) {
            element.setAttribute("tabindex", "-1");
        }
        element.focus();
    }

    function isNaturallyFocusable(element) {
        var tagName = element.tagName ? element.tagName.toLowerCase() : "";
        return tagName === "button" || tagName === "input" || tagName === "select" || tagName === "a" || tagName === "textarea";
    }

    function dedupeQuestions(items) {
        var seen = {};
        var result = [];
        items.forEach(function (item) {
            var key = getLearnerQuestionText(item).toLowerCase().replace(/\s+/g, " ").trim();
            if (!seen[key]) {
                seen[key] = true;
                result.push(item);
            }
        });
        return result;
    }

    function shuffle(items) {
        var copy = items.slice();
        var i;
        var j;
        var temp;
        for (i = copy.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1));
            temp = copy[i];
            copy[i] = copy[j];
            copy[j] = temp;
        }
        return copy;
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            return;
        }
    }

    function loadState() {
        var raw;
        var saved;
        try {
            raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return;
            }
            saved = JSON.parse(raw);
            state.mode = saved.mode || state.mode;
            state.questionStyle = saved.questionStyle || state.questionStyle;
            state.levelFilter = saved.levelFilter || state.levelFilter;
            state.domain = saved.domain || state.domain;
            state.domains = Array.isArray(saved.domains) && saved.domains.length ? saved.domains : (saved.domain ? [saved.domain] : state.domains);
            state.sessionQuestions = Array.isArray(saved.sessionQuestions) ? saved.sessionQuestions : [];
            state.currentIndex = Number(saved.currentIndex) || 0;
            state.selectedChoice = saved.selectedChoice === null ? null : saved.selectedChoice;
            state.answered = Boolean(saved.answered);
            state.sessionCorrect = Number(saved.sessionCorrect) || 0;
            state.sessionIncorrect = Number(saved.sessionIncorrect) || 0;
            state.stats = mergeStats(saved.stats);
            state.missedQuestions = Array.isArray(saved.missedQuestions) ? saved.missedQuestions : [];
            state.reviewIndex = Number(saved.reviewIndex) || 0;
            state.reviewingMissed = Boolean(saved.reviewingMissed);
            state.lastResultsText = saved.lastResultsText || "";
            state.lastResultsStatus = saved.lastResultsStatus || "";
        } catch (error) {
            state.stats = makeEmptyStats();
        }
    }

    function mergeStats(savedStats) {
        var stats = makeEmptyStats();
        if (!savedStats) {
            return stats;
        }
        stats.totalAnswered = Number(savedStats.totalAnswered) || 0;
        stats.correct = Number(savedStats.correct) || 0;
        stats.incorrect = Number(savedStats.incorrect) || 0;
        stats.currentStreak = Number(savedStats.currentStreak) || 0;
        stats.bestStreak = Number(savedStats.bestStreak) || 0;
        Object.keys(stats.domains).forEach(function (domainId) {
            if (savedStats.domains && savedStats.domains[domainId]) {
                stats.domains[domainId].answered = Number(savedStats.domains[domainId].answered) || 0;
                stats.domains[domainId].correct = Number(savedStats.domains[domainId].correct) || 0;
                stats.domains[domainId].incorrect = Number(savedStats.domains[domainId].incorrect) || 0;
            }
        });
        return stats;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", onReady);
    } else {
        onReady();
    }
}());
/* END ANCHOR (WCAG_OPEN_DOOR_ACCESSIBILITY_LAB_APP_V1) */
