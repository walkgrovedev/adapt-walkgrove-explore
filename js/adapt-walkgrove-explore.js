define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var ExploreView = ComponentView.extend({

    events: {
      'click .js-click-area': 'onSelectArea',
      'click .js-info-close-btn': 'onCloseInfo'
    },
    
    _isPopupOpen: false,
    
    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();      
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },



    onSelectArea: function(event) {
      if (this._isPopupOpen) return;

      this._isPopupOpen = true;
      const popupIndex = this.$(event.currentTarget).data('index');

      if (!this.model.get('_popupsinline')) {
        this.openPopup(popupIndex);
      } else {
        this.$('.explore__content').addClass('is-visible'); 
        this.$('.explore__info').eq(popupIndex).addClass('is-visible'); 
      }

      this.setItemVisited(popupIndex);
    },

    onCloseInfo: function (event) {
      this.model.get('_items').forEach(function(item, index) {
        this.$('.explore__info').eq(index).removeClass('is-visible'); 
      });
      this.$('.explore__content').removeClass('is-visible'); 
      this._isPopupOpen = false;
    },

    openPopup: function(_popupIndex) {

      let title = "";
      let content = "";
      
      this.model.get('_items').forEach(function(item, index) {
        if (_popupIndex === index) {
          title = item.title;
          content = item.body;
        }
      });

      Adapt.trigger("notify:popup", {
        title: title,
        body: content,
        _showCloseButton: true
      });

      this.listenToOnce(Adapt, {
        'popup:closed': this.onPopupClosed
      });
    },

    onPopupClosed: function() {
      this._isPopupOpen = false;
    },



    setItemVisited: function(index) {
      this.$('.explore__area').eq(index).addClass('is-visited');
      this.checkAllItemsCompleted();
    },

    checkAllItemsCompleted: function() {
      var complete = false;
      if(this.$('.explore__area').length === this.$('.is-visited').length){
        complete = true;
      }
      if(complete) {
        this.setCompletionStatus();
      }
    }




  },
  {
    template: 'explore'
  });

  return Adapt.register('explore', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: ExploreView
  });
});
