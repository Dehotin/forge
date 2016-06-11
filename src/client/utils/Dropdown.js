/////////////////////////////////////////////////////////////
// Create dropwdown menu
//
/////////////////////////////////////////////////////////////
import EventsEmitter from 'EventsEmitter';

export default class Dropdown extends EventsEmitter {
  
  /////////////////////////////////////////////////////////////
  // opts = {
  //   container: viewer.container,
  //   title: 'Material',
  //   prompt: 'Select from list'
  //   pos: {
  //    top: 10,
  //    left: 10
  //   },
  //   selectedItemIdx: 2,
  //   menuItems: [
  //    {
  //      name: item1,
  //      handler: function(){}
  //    }
  //   ]
  // }
  //
  /////////////////////////////////////////////////////////////
  constructor(opts) {

    super()

    this.dropdownId = guid()

    this.buttonId = guid()

    this.labelId = guid()

    this.listId = guid()

    this.currentItem = null

    this.title = opts.title || 'Select Item: '

    var html = `
      <div id="${this.dropdownId}" class="dropdown lmv-dropdown">
      <button id="${this.buttonId}" class="btn dropdown-toggle"
        type="button" 
        data-toggle="dropdown" disabled>
        <div class="label-container">
          <label id="${this.labelId}" class="label">${this.title}</label>
          <span class="caret"></span>
        </div>
      </button>
      <ul id="${this.listId}" class="dropdown-menu scrollable-menu">
      </ul>
      </div>
    `;

    $(opts.container).append(html);

    $('#' + this.dropdownId).css(opts.pos);

    opts.menuItems = opts.menuItems || [];

    var text = opts.prompt ||  this.title + ': ' +
     opts.menuItems[opts.selectedItemIdx || 0].name;

    $('#' + this.labelId).text(text);

    opts.menuItems.forEach((item)=> {

      this.addItem(item);
    });
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  addItem(item, setActive = false) {

    $('#' + this.buttonId).prop('disabled', false);

    var itemId = item.id || guid();

    var itemHtml = `
      <li id="${itemId}">
        <a href="">${item.name}</a>
      </li>`;

    $('#' + this.listId).append(itemHtml);

    var onClick = (event)=> {

      if(event){

        event.preventDefault();
      }

      this.currentItem = item

      var eventResult = this.emit(
        'item.selected',
        item);

      if(item.handler)
        item.handler();

      $('#' + this.labelId).text(
        this.title + ': ' + item.name);
    };

    $('#' + itemId).click((e)=>{
      onClick(e);
    });

    if(setActive){
      onClick();
    }
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  setCurrentItem(item) {

    $('#' + this.labelId).text(
      this.title + ': ' + item.name);
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  setItems(items, selectedItemIdx = 0) {

    $(`#${this.listId} li`).remove();

    var text = this.title + ': ' +
      items[selectedItemIdx].name;

    $('#' + this.labelId).text(text);

    items.forEach((item)=>{

      this.addItem(item);
    });
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  removeCurrentItem(prompt) {

    if(this.currentItem){

      $('#' + this.currentItem.id).remove()

      if($('#' + this.listId + ' > li').length === 0){

        $('#' + this.buttonId).prop('disabled', true)
      }

      this.currentItem = null
    }

    $('#' + this.labelId).text(prompt)

    this.emit('item.selected', null)
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  setVisible(show) {
    
    $('#' + this.dropdownId).css({
      display: show ? 'block' : 'none'
    });
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  setPosition(pos) {

    $('#' + this.dropdownId).css(opts.pos);
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  open() {

    $('#' + this.dropdownId).addClass('open');
    $('#' + this.dropdownId).trigger('click.bs.dropdown');
  }
}

/////////////////////////////////////////////////////////////
//
//
/////////////////////////////////////////////////////////////
function guid(format='xxxxxxxx') {

  var d = new Date().getTime();

  var guid = format.replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });

  return guid;
}

/////////////////////////////////////////////////////////////
//
//
/////////////////////////////////////////////////////////////
var css = `

  .lmv-dropdown .btn {
     background-color: #3C3F40;
     height: 13px;
     line-height: 0;
     vertical-align: top;
  }

  .lmv-dropdown .label {
    font: normal 14px Times New Roman;
  }
  
  .scrollable-menu {
    height: auto;
    max-height: 250px;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .lmv-dropdown .label-container{
    width: 100%;
    overflow: hidden;
  }

  .lmv-dropdown .caret{
    border-top:4px solid white;
  }
`;

$('<style type="text/css">' + css + '</style>').appendTo('head');