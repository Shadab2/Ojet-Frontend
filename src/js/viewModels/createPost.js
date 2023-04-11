/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define([
  "knockout",
  "../context/userContext",
  "../services/postService",
  "../services/ToastService",
  "ojs/ojarraydataprovider",
  "text!../data/techStackData.json",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojfilepicker",
  "ojs/ojformlayout",
  "ojs/ojavatar",
  "ojs/ojconveyorbelt",
  "ojs/ojtrain",
], function (
  ko,
  UserContext,
  PostService,
  ToastService,
  ArrayDataProvider,
  TechStackJson
) {
  function CreatePostViewModel(params) {
    var self = this;
    self.activeTab = params.activeTab;
    self.post = ko.observable({});
    self.user = UserContext.user;
    // image upload
    self.filesToUpload = ko.observableArray([]);
    self.loading = ko.observable(false);
    self.handleFileChange = function (e) {
      const files = e.detail.files;
      const savedFiles = self.filesToUpload();
      if (files.length > 0)
        for (let file of files) {
          if (savedFiles.find((fl) => fl.name === file.name)) continue;
          self.filesToUpload.push(file);
        }
    };

    self.messages = ko.observableArray(null);

    self.invalidListener = function () {
      self.messages([ToastService.error("Invalid File Type")]);
    };

    // for oj-select-many
    self.selectedManyValue = ko.observableArray([]);
    self.postTitle = ko.observable("");
    self.postDesc = ko.observable("");
    const parsedTechStacks = JSON.parse(TechStackJson);
    self.optionDataProvider = new ArrayDataProvider(parsedTechStacks, {
      keyAttributes: "value",
    });

    self.youtubeLink = ko.observable("");

    self.addMoreLinkHandler = () => {
      self.linkId(1);
    };
    self.linkId = ko.observable(0);

    self.link1 = ko.observable({
      link: "",
      desc: "",
    });
    self.link2 = ko.observable({
      link: "",
      desc: "",
    });

    // for oj-train
    self.selectedValue = ko.observable({
      label: "Tech Stack",
      id: "stp1",
      step: "stp1",
    });

    self.stepArray = ko.observableArray([
      { label: "Tech Stack", id: "stp1", step: "stp1", disabled: true },
      { label: "Title", id: "stp2", step: "stp2", disabled: true },
      { label: "Add Desc", id: "stp3", step: "stp3", disabled: true },
      { label: "Resources", id: "stp4", step: "stp4", disabled: true },
      { label: "Post", id: "stp5", step: "stp5", disabled: true },
    ]);

    self.selectedSteps = ko.computed(function () {
      if (self.selectedManyValue().length == 0) {
        self.stepArray()[0].disabled = false;
        self.selectedValue(self.stepArray()[0]);
      } else if (self.postTitle() === "") {
        self.stepArray()[1].disabled = false;
        self.selectedValue(self.stepArray()[1]);
      } else if (self.postDesc() === "") {
        self.stepArray()[2].disabled = false;
        self.selectedValue(self.stepArray()[2]);
      } else if (self.link1().link === "") {
        self.stepArray()[3].disabled = false;
        self.selectedValue(self.stepArray()[3]);
      } else {
        self.stepArray()[4].disabled = false;
        self.selectedValue(self.stepArray()[4]);
      }
      return self.selectedValue();
    });

    self.nextStep = () => {
      const train = document.getElementById("train");
      const next = train.getNextSelectableStep();
      if (next != null) {
        self.selectedValue({
          step: next,
          label: train.getStep(next).label,
        });
      }
    };

    self.preiousStep = () => {
      const train = document.getElementById("train");
      const prev = train.getPreviousSelectableStep();
      if (prev != null) {
        self.selectedValue({
          step: prev,
          label: train.getStep(prev).label,
        });
      }
    };

    self.updateSteps = function (event) {
      var train = document.getElementById("train");
      let selectedStep = train.getStep(event.detail.value);
      if (selectedStep !== null)
        self.selectedValue({
          ...self.selectedValue(),
          label: selectedStep.label,
        });
    };

    self.page = ko.computed(function () {
      const curStep = self.selectedValue().step;
      if (curStep === "stp1" || curStep === "stp2" || curStep === "stp3")
        return 0;
      else if (curStep === "stp4") return 1;
      else return 2;
    });

    self.isNextEnabled = ko.computed(function () {
      return self.selectedValue().step === "stp3";
    });

    function getId(url) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      return match && match[2].length === 11 ? match[2] : null;
    }

    self.handleNextClick = function (index) {
      if (index === 4) {
        const post = {
          title: self.postTitle(),
          description: self.postDesc(),
          techStacks: self.selectedManyValue().map((item) => ({
            name: item,
            description: item,
          })),
          resourceLinks: [
            { description: self.link1().desc, link: self.link1().link },
          ],
          files: self.filesToUpload(),
          images: self.filesToUpload().map((file) => URL.createObjectURL(file)),
        };
        if (self.link2().link)
          post["resourceLinks"].push({
            description: self.link2().desc,
            link: self.link2().link,
          });
        if (self.youtubeLink !== "")
          post.youtubeLink =
            "https://www.youtube.com/embed/" + getId(self.youtubeLink());
        self.post(post);
      }
      self.selectedValue(self.stepArray()[index]);
    };

    self.submitPost = async function () {
      self.loading(true);
      try {
        const res = await PostService.savePost(self.post());
        self.loading(false);
        self.activeTab("home");
      } catch (e) {
        self.loading(false);
        console.log(e);
      }
    };
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return CreatePostViewModel;
});
