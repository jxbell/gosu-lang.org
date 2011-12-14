
// get the context, which is the shortname for the book, such as rules, studio, etc
function Guidewire_GetContext(thisPane) {
   var  info;
   var  bookIndex;
   var  fileIndex;
   var  anchor;
   var  book;
   var  context;

  var VarDocumentFrame = eval(WWHFrame.WWHHelp.fGetFrameReference("WWHDocumentFrame"));
  var VarDocumentURL = WWHFrame.WWHBrowser.fNormalizeURL(VarDocumentFrame.location.href);

   info = WWHFrame.WWHHelp.fHREFToBookIndexFileIndexAnchor(VarDocumentURL);

   // You've just received an array of book index, file index, anchor
   //
   bookIndex = info[0];
   fileIndex = info[1];
   anchor = info[2];

   // Query the book for its context
   if (bookIndex >= 0)
   {
     book = WWHFrame.WWHHelp.mBooks.fGetBook(bookIndex);
     context = book.mContext;
   }
 return context;
}



// get the filename
function Guidewire_GetSourceFile(thisPane) {
   var  info;
   var  bookIndex;
   var  fileIndex;
   var  anchor;
   var  book;
   var  context = "";

  var VarDocumentFrame = eval(WWHFrame.WWHHelp.fGetFrameReference("WWHDocumentFrame"));
  var VarDocumentURL = WWHFrame.WWHBrowser.fNormalizeURL(VarDocumentFrame.location.href);

  // split URL into chunks separated by slash chars to get filename
  var VarSplitURL= VarDocumentURL.split("/");
  var VarLastSectionInURL = VarSplitURL[VarSplitURL.length - 1];

  // split filename (usually in form "myfilename.4.5") by period chars, and take the first one
  var VarLastSectionInURL = VarLastSectionInURL.split(".")[0];


 return VarLastSectionInURL ;
}

// this function takes a topic Name and converts it to a simpler string, such as underscores instead of space chars
// This is also important because FrameMaker + ePubs's  native handling of topic alias names mirror this behavior
//
// IMPORTANT: IF YOU CHANGE THIS CODE, ALSO CHANGE THE MIRROR FUNCTION IN TOPICUTILS.FSL
function Guidewire_SafeTopicName(theTitle) {

  // convert space and non-breaking space chars
  theTitle = theTitle.replace(/ /g, "_");  // converts space char
  theTitle = theTitle.replace(/\u00a0/g, "_");  // converts nbsp char

  // censor (remove) characters that mess up epublisher in URLs: forward slash, backslash, question mark, &amp;
  theTitle= theTitle.replace(/[\\\/\?]/g, "");
  //alert(theTitle);// DEBUG
  theTitle = theTitle.replace(/&/g, "");
  theTitle = theTitle.replace(/\u201c/g, "'"); // single quote smart
  theTitle = theTitle.replace(/\u201d/g, "'"); // single quote smart
  theTitle = theTitle.replace(/\u2018/g, "'"); // dub quote smart
  theTitle = theTitle.replace(/\u2019/g, "'"); // dub quote smart
  theTitle = theTitle.replace(/\u2122/g, ""); // trademark
  //alert(theTitle);// DEBUG
 return (theTitle);
}


// get the long URL in the official Guidewire way
// The argument is basically the pane that would normally get the messages. we do this so we can get properties from it
function Guidewire_GetLongURL(thisPane) {

  // Get the context (the book shortname)
  var myContextString = Guidewire_GetContext(thisPane);
  if (myContextString == null) {
     myContextString = ''; // we should never get here... should we bail? use href file path instead? display an error dialog?
  }
  else {
     myContextString = "&context="+myContextString;
  }


  /* WE DO NOT USE DIRECT HREF ANYMORE, but we save this for reference!
     var myPageURLWithHREF = "wwhelp/wwhimpl/api.htm?href=" + WWHFrame.WWHBrowser.fRestoreEscapedSpaces(WWHFrame.WWHHelp.fGetBookFileHREF(thisPane.mSyncPrevNext[0]));
  */


  var mySourceFile = Guidewire_GetSourceFile(thisPane);


  var myPageURL = "wwhelp/wwhimpl/api.htm?";


  // get the page title, and then sanitize it (such as converting space chars to underscores)
  // note that we have to remove the naive WWH encoding first to convert unicode, then we do our underscore subsitution
  // and censoring of a few common odd characters, and then we use the encodeURIComponent function to do the final encoding in a UTF8 friendly way
  var myTitleWithSimpleURLEncoding = WWHFrame.WWHHelp.fHREFToTitle(thisPane.mSyncPrevNext[0]);
  var myTitleWithUnicodeEncoding = WWHStringUtilities_UnescapeHTML(myTitleWithSimpleURLEncoding);
  var mySafeUnicodeTitle = Guidewire_SafeTopicName(myTitleWithUnicodeEncoding);

  return WWHFrame.WWHHelp.mHelpURLPrefix + myPageURL + myContextString + "&src="+mySourceFile + "&topic=" + encodeURIComponent(mySafeUnicodeTitle) ;


}

function Guidewire_LinkToThis_Toggle(myurl, mytitle) {

   var docFrame = eval(WWHFrame.WWHHelp.fGetFrameReference("WWHDocumentFrame"));

   var thePopup = docFrame.document.getElementById('linkToThisPage');


    // if it is currently shown, hide it...
    if (thePopup.style.display=="") {
		thePopup.style.display="none";
 
	}
    //if it is hidden, show it...
    else {
        //myurl = "http://test.com";
        //mytitle = "test";

        var bookmarkurl = "To bookmark this page, right-click on this link:<br><a target=\"_top\" href=\""+myurl+"\">"+mytitle+"</a>";

        var thePopupBookmark = docFrame.document.getElementById('linkToThisPageBookmark');
        var thePopupURL = docFrame.document.getElementById('linkToThisPageURL');

        thePopupBookmark.innerHTML = bookmarkurl + "<br><br>Or you can copy this address:";
        thePopupURL.value = myurl;

        //thePopup.style.top = docFrame.scrollTop;
	thePopup.style.display=""; // show the popup
	}

}







// Copyright (c) 2000-2003 Quadralay Corporation.  All rights reserved.
//

function  WWHControlEntry_Object(ParamControlName,
                                 bParamEnabled,
                                 bParamStatus,
                                 ParamLabel,
                                 ParamIconEnabled,
                                 ParamIconDisabled,
                                 ParamAnchorMethod,
                                 ParamFrameName)
{
  this.mControlName  = ParamControlName;
  this.mbEnabled     = bParamEnabled;
  this.mbStatus      = bParamStatus;
  this.mLabel        = ParamLabel;
  this.mIconEnabled  = ParamIconEnabled;
  this.mIconDisabled = ParamIconDisabled;
  this.mAnchorMethod = ParamAnchorMethod;
  this.mFrameName    = ParamFrameName;

  this.fSetStatus  = WWHControlEntry_SetStatus;
  this.fGetIconURL = WWHControlEntry_GetIconURL;
  this.fGetHTML    = WWHControlEntry_GetHTML;
  this.fGetLabel   = WWHControlEntry_GetLabel;
  this.fUpdateIcon = WWHControlEntry_UpdateIcon;
}

function  WWHControlEntry_SetStatus(bParamStatus)
{
  if (this.mbEnabled)
  {
    this.mbStatus = bParamStatus;
  }
  else
  {
    this.mbStatus = false;
  }
}

function  WWHControlEntry_GetIconURL()
{
  var  VarIconURL = "";


  if (this.mbEnabled)
  {
    // Create absolute path to icon
    //
    VarIconURL += WWHFrame.WWHHelp.mHelpURLPrefix;
    VarIconURL += "wwhelp/wwhimpl/common/images/";

    // Determine which icon to return
    //
    if (this.mbStatus)
    {
      VarIconURL += this.mIconEnabled;
    }
    else
    {
      VarIconURL += this.mIconDisabled;
    }
  }

  return VarIconURL;
}

function  WWHControlEntry_GetHTML()
{
  var  VarHTML = "";
  var  VarStyleAttribute;
  var  VarLabel;


  // Set style attribute to insure small image height
  //
  VarStyleAttribute = " style=\"font-size: 1px; line-height: 1px;\"";

  if (this.mbEnabled)
  {
    // Set label
    //
    VarLabel = this.mLabel;
    if (WWHFrame.WWHHelp.mbAccessible)
    {
      if ( ! this.mbStatus)
      {
        VarLabel = WWHStringUtilities_FormatMessage(WWHFrame.WWHHelp.mMessages.mAccessibilityDisabledNavigationButton, this.mLabel);
        VarLabel = WWHStringUtilities_EscapeHTML(VarLabel);
      }
    }
    VarLabel = WWHStringUtilities_EscapeHTML(VarLabel);

    // Display control
    //
    VarHTML += "  <td >";
    VarHTML += "<div" + VarStyleAttribute + ">";
    VarHTML += "<a name=\"" + this.mControlName + "\" href=\"javascript:WWHFrame.WWHControls." + this.mAnchorMethod + "();\" title=\"" + VarLabel + "\">";
    VarHTML += "<img name=\"" + this.mControlName + "\" alt=\"" + VarLabel + "\" border=\"0\" src=\"" + this.fGetIconURL() + "\" height=\"21\">";
    VarHTML += "</a>";
    VarHTML +=" </div>";
    VarHTML += "</td>\n";
  }

  return VarHTML;
}

function  WWHControlEntry_GetLabel()
{
  var  VarLabel = "";


  if (this.mbEnabled)
  {
    // Set label
    //
    VarLabel = this.mLabel;
  }

  return VarLabel;
}

function  WWHControlEntry_UpdateIcon()
{
  var  VarControlDocument;


  if (this.mbEnabled)
  {
    // Access control document
    //
    VarControlDocument = eval(WWHFrame.WWHHelp.fGetFrameReference(this.mFrameName) + ".document");

    // Update icon
    //
    VarControlDocument.images[this.mControlName].src = this.fGetIconURL();
  }
}

function  WWHControlEntries_Object()
{
}

function  WWHControls_Object()
{
  this.mControls      = new WWHControlEntries_Object();
  this.mSyncPrevNext  = new Array(null, null, null);
  this.mFocusedFrame  = "";
  this.mFocusedAnchor = "";

  this.fReloadControls        = WWHControls_ReloadControls;
  this.fControlsLoaded        = WWHControls_ControlsLoaded;
  this.fAddControl            = WWHControls_AddControl;
  this.fGetControl            = WWHControls_GetControl;
  this.fInitialize            = WWHControls_Initialize;
  this.fSansNavigation        = WWHControls_SansNavigation;
  this.fCanSyncTOC            = WWHControls_CanSyncTOC;
  this.fTopSpacerHTML         = WWHControls_TopSpacerHTML;
  this.fLeftHTML              = WWHControls_LeftHTML;
  this.fRightHTML             = WWHControls_RightHTML;
  this.fLeftFrameTitle        = WWHControls_LeftFrameTitle;
  this.fRightFrameTitle       = WWHControls_RightFrameTitle;
  this.fUpdateHREF            = WWHControls_UpdateHREF;
  this.fRecordFocus           = WWHControls_RecordFocus;
  this.fRestoreFocus          = WWHControls_RestoreFocus;
  this.fSwitchToNavigation    = WWHControls_SwitchToNavigation;
  this.fHasPDFLink            = WWHControls_HasPDFLink;
  this.fClickedShowNavigation = WWHControls_ClickedShowNavigation;
  this.fClickedSyncTOC        = WWHControls_ClickedSyncTOC;
  this.fClickedPrevious       = WWHControls_ClickedPrevious;
  this.fClickedNext           = WWHControls_ClickedNext;
  this.fClickedPDF            = WWHControls_ClickedPDF;
  this.fClickedRelatedTopics  = WWHControls_ClickedRelatedTopics;
  this.fClickedEmail          = WWHControls_ClickedEmail;
  this.fClickedPrint          = WWHControls_ClickedPrint;
  this.fClickedBookmark       = WWHControls_ClickedBookmark;
  this.fShowNavigation        = WWHControls_ShowNavigation;
  this.fSyncTOC               = WWHControls_SyncTOC;
  this.fPrevious              = WWHControls_Previous;
  this.fNext                  = WWHControls_Next;
  this.fPDF                   = WWHControls_PDF;
  this.fRelatedTopics         = WWHControls_RelatedTopics;
  this.fEmail                 = WWHControls_Email;
  this.fPrint                 = WWHControls_Print;
  this.fBookmark              = WWHControls_Bookmark;
  this.fBookmarkData          = WWHControls_BookmarkData;
  this.fBookmarkLink          = WWHControls_BookmarkLink;
  this.fProcessAccessKey      = WWHControls_ProcessAccessKey;
}

function  WWHControls_ReloadControls()
{
  // Load the left frame it it will cascade and load the other frames
  //
  WWHFrame.WWHHelp.fReplaceLocation("WWHControlsLeftFrame", WWHFrame.WWHHelp.mHelpURLPrefix + "wwhelp/wwhimpl/common/html/controll.htm");
}

function  WWHControls_ControlsLoaded(ParamDescription)
{
  if (ParamDescription == "left")
  {
    WWHFrame.WWHHelp.fReplaceLocation("WWHControlsRightFrame", WWHFrame.WWHHelp.mHelpURLPrefix + "wwhelp/wwhimpl/common/html/controlr.htm");
  }
  else if (ParamDescription == "right")
  {
    WWHFrame.WWHHelp.fReplaceLocation("WWHTitleFrame", WWHFrame.WWHHelp.mHelpURLPrefix + "wwhelp/wwhimpl/common/html/title.htm");
  }
  else  // (ParamDescription == "title")
  {
    if ( ! WWHFrame.WWHHelp.mbInitialized)
    {
      // All control frames are now loaded
      //
      WWHFrame.WWHHelp.fInitStage(5);
    }
    else
    {
      // Restore previous focus
      //
      this.fRestoreFocus();
    }
  }
}

function  WWHControls_AddControl(ParamControlName,
                                 bParamEnabled,
                                 bParamStatus,
                                 ParamLabel,
                                 ParamIconEnabled,
                                 ParamIconDisabled,
                                 ParamAnchorMethod,
                                 ParamFrameName)
{
  var  VarControlEntry;


  VarControlEntry = new WWHControlEntry_Object(ParamControlName,
                                               bParamEnabled,
                                               bParamStatus,
                                               ParamLabel,
                                               ParamIconEnabled,
                                               ParamIconDisabled,
                                               ParamAnchorMethod,
                                               ParamFrameName);

  this.mControls[ParamControlName + "~"] = VarControlEntry;
}

function  WWHControls_GetControl(ParamControlName)
{
  var  VarControlEntry;


  VarControlEntry = this.mControls[ParamControlName + "~"];
  if (typeof(VarControlEntry) == "undefined")
  {
    VarControlEntry = null;
  }

  return VarControlEntry;
}

function  WWHControls_Initialize()
{
  var  VarSettings;
  var  VarDocumentFrame;


  // Access settings
  //
  VarSettings = WWHFrame.WWHHelp.mSettings;

  // Confirm Sync TOC can be enabled
  //
  if (this.fSansNavigation())
  {
    VarSettings.mbSyncContentsEnabled = false;
  }


// GUIDEWIRE always email
  VarSettings.mbEmailEnabled = true;
  // Confirm E-mail can be enabled
  //
  if (VarSettings.mbEmailEnabled)
  {
// GUIDEWIRE COMMENT THIS OUT SO THAT EMAIL IS ALWAYS AVAILABLE EVEN IF EMPTY STRING
   // VarSettings.mbEmailEnabled = ((typeof(VarSettings.mEmailAddress) == "string") &&
   //                               (VarSettings.mEmailAddress.length > 0));
  }

  // Confirm Print can be enabled
  //
  if (VarSettings.mbPrintEnabled)
  {
    VarDocumentFrame = eval(WWHFrame.WWHHelp.fGetFrameReference("WWHTitleFrame"));
    VarSettings.mbPrintEnabled = ((typeof(VarDocumentFrame.focus) != "undefined") &&
                                  (typeof(VarDocumentFrame.print) != "undefined"))
  }

  // Create control entries
  //
  this.fAddControl("WWHFrameSetIcon", this.fSansNavigation(), this.fSansNavigation(),
                   WWHFrame.WWHHelp.mMessages.mShowNavigationIconLabel,
                   "shownav.gif", "shownav.gif", "fClickedShowNavigation", "WWHControlsLeftFrame");
  this.fAddControl("WWHSyncTOCIcon", VarSettings.mbSyncContentsEnabled, false,
                   WWHFrame.WWHHelp.mMessages.mSyncIconLabel,
                   "sync.gif", "syncx.gif", "fClickedSyncTOC", "WWHControlsLeftFrame");
  this.fAddControl("WWHPrevIcon", VarSettings.mbPrevEnabled, false,
                   WWHFrame.WWHHelp.mMessages.mPrevIconLabel,
                   "prev.gif", "prevx.gif", "fClickedPrevious", "WWHControlsLeftFrame");
  this.fAddControl("WWHNextIcon", VarSettings.mbNextEnabled, false,
                   WWHFrame.WWHHelp.mMessages.mNextIconLabel,
                   "next.gif", "nextx.gif", "fClickedNext", "WWHControlsLeftFrame");
  this.fAddControl("WWHPDFIcon", VarSettings.mbPDFEnabled, false,
                   WWHFrame.WWHHelp.mMessages.mPDFIconLabel,
                   "pdf.gif", "pdfx.gif", "fClickedPDF", "WWHControlsRightFrame");
  this.fAddControl("WWHRelatedTopicsIcon", VarSettings.mbRelatedTopicsEnabled, false,
                   WWHFrame.WWHHelp.mMessages.mRelatedTopicsIconLabel,
                   "related.gif", "relatedx.gif", "fClickedRelatedTopics", "WWHControlsRightFrame");
  this.fAddControl("WWHEmailIcon", VarSettings.mbEmailEnabled, false,
                   WWHFrame.WWHHelp.mMessages.mEmailIconLabel,
                   "email.gif", "emailx.gif", "fClickedEmail", "WWHControlsRightFrame");
  this.fAddControl("WWHPrintIcon", VarSettings.mbPrintEnabled, false,
                   WWHFrame.WWHHelp.mMessages.mPrintIconLabel,
                   "print.gif", "printx.gif", "fClickedPrint", "WWHControlsRightFrame");
  this.fAddControl("WWHBookmarkIcon", VarSettings.mbBookmarkEnabled, false,
                   WWHFrame.WWHHelp.mMessages.mBookmarkIconLabel,
                   "bkmark.gif", "bkmarkx.gif", "fClickedBookmark", "WWHControlsRightFrame");

  // Load control frames
  //
  this.fReloadControls();
}

function  WWHControls_SansNavigation()
{
  var  bSansNavigation = false;


  if (WWHFrame.WWHHelp.fSingleTopic())
  {
    bSansNavigation = true;
  }

  return bSansNavigation;
}

function  WWHControls_CanSyncTOC()
{
  var  bVarCanSyncTOC = false;


  if (this.mSyncPrevNext[0] != null)
  {
    bVarCanSyncTOC = true;
  }

  return bVarCanSyncTOC;
}

function  WWHControls_TopSpacerHTML()
{
  var  VarHTML = "";
  var  VarStyleAttribute;

  // Set style attribute to insure small image height
  //
  VarStyleAttribute = " style=\"font-size: 1px; line-height: 1px;\"";

  VarHTML += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n";
  VarHTML += " <tr>\n";
  VarHTML += "  <td><div" + VarStyleAttribute + "><img src=\"" + WWHFrame.WWHHelp.mHelpURLPrefix + "wwhelp/wwhimpl/common/images/spc_tb_t.gif" + "\" alt=\"\"></div></td>\n";
  VarHTML += " </tr>\n";
  VarHTML += "</table>\n";

  return VarHTML;
}

function  WWHControls_LeftHTML()
{
  var  VarHTML = "";
  var  VarEnabledControls;
  var  VarControl;
  var  VarMaxIndex;
  var  VarIndex;

  // Confirm user did not reload the frameset
  //
  if (this.fGetControl("WWHFrameSetIcon") != null)
  {
    // Determine active controls
    //
    VarEnabledControls = new Array();
    VarControl = this.fGetControl("WWHFrameSetIcon");
    if (VarControl.mbEnabled)
    {
      VarEnabledControls[VarEnabledControls.length] = VarControl;
    }
    VarControl = this.fGetControl("WWHSyncTOCIcon");
    if (VarControl.mbEnabled)
    {
      VarEnabledControls[VarEnabledControls.length] = VarControl;
    }
    VarControl = this.fGetControl("WWHPrevIcon");
    if (VarControl.mbEnabled)
    {
      VarEnabledControls[VarEnabledControls.length] = VarControl;
    }
    VarControl = this.fGetControl("WWHNextIcon");
    if (VarControl.mbEnabled)
    {
      VarEnabledControls[VarEnabledControls.length] = VarControl;
    }

    // Emit HTML for controls
    //
    VarHTML += this.fTopSpacerHTML();
    if (VarEnabledControls.length > 0)
    {
      VarHTML += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n";
      VarHTML += " <tr>\n";

      VarHTML += "  <td><div><img src=\"" + WWHFrame.WWHHelp.mHelpURLPrefix + "wwhelp/wwhimpl/common/images/spc_tb_l.gif" + "\" alt=\"\"></div></td>\n";
      for (VarMaxIndex = VarEnabledControls.length, VarIndex = 0 ; VarIndex < VarMaxIndex ; VarIndex++)
      {
        VarHTML += VarEnabledControls[VarIndex].fGetHTML();
        if ((VarIndex + 1) < VarMaxIndex)
        {
          VarHTML += "  <td><div><img src=\"" + WWHFrame.WWHHelp.mHelpURLPrefix + "wwhelp/wwhimpl/common/images/spc_tb_m.gif" + "\" alt=\"\"></div></td>\n";
        }
      }

      VarHTML += " </tr>\n";
      VarHTML += "</table>\n";
    }
  }

  return VarHTML;
}

function  WWHControls_RightHTML()
{
  var  VarHTML = "";
  var  VarEnabledControls;
  var  VarControl;
  var  VarMaxIndex;
  var  VarIndex;

  // Confirm user did not reload the frameset
  //
  if (this.fGetControl("WWHRelatedTopicsIcon") != null)
  {
    // Determine active controls
    //
    VarEnabledControls = new Array();
    VarControl = this.fGetControl("WWHPDFIcon");
    if (VarControl.mbEnabled)
    {
      VarEnabledControls[VarEnabledControls.length] = VarControl;
    }
    VarControl = this.fGetControl("WWHRelatedTopicsIcon");
    if (VarControl.mbEnabled)
    {
      VarEnabledControls[VarEnabledControls.length] = VarControl;
    }
    VarControl = this.fGetControl("WWHEmailIcon");
    if (VarControl.mbEnabled)
    {
      VarEnabledControls[VarEnabledControls.length] = VarControl;
    }
    VarControl = this.fGetControl("WWHPrintIcon");
    if (VarControl.mbEnabled)
    {
      VarEnabledControls[VarEnabledControls.length] = VarControl;
    }
    VarControl = this.fGetControl("WWHBookmarkIcon");
    if (VarControl.mbEnabled)
    {
      VarEnabledControls[VarEnabledControls.length] = VarControl;
    }

    // Emit HTML for controls
    //
    VarHTML += this.fTopSpacerHTML();
    if (VarEnabledControls.length > 0)
    {
      VarHTML += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n";
      VarHTML += " <tr>\n";

      for (VarMaxIndex = VarEnabledControls.length, VarIndex = 0 ; VarIndex < VarMaxIndex ; VarIndex++)
      {
        VarHTML += VarEnabledControls[VarIndex].fGetHTML();
        if ((VarIndex + 1) < VarMaxIndex)
        {
          VarHTML += "  <td><div><img src=\"" + WWHFrame.WWHHelp.mHelpURLPrefix + "wwhelp/wwhimpl/common/images/spc_tb_m.gif" + "\" alt=\"\"></div></td>\n";
        }
      }
      VarHTML += "  <td><div><img src=\"" + WWHFrame.WWHHelp.mHelpURLPrefix + "wwhelp/wwhimpl/common/images/spc_tb_r.gif" + "\" alt=\"\"></div></td>\n";

      VarHTML += " </tr>\n";
      VarHTML += "</table>\n";
    }
  }

  return VarHTML;
}

function  WWHControls_LeftFrameTitle()
{
  var  VarTitle = "";


  if (this.fGetControl("WWHFrameSetIcon").fGetLabel().length > 0)
  {
    if (VarTitle.length > 0)
    {
      VarTitle += WWHFrame.WWHHelp.mMessages.mAccessibilityListSeparator + " ";
    }
    VarTitle += this.fGetControl("WWHFrameSetIcon").fGetLabel();
  }

  if (this.fGetControl("WWHSyncTOCIcon").fGetLabel().length > 0)
  {
    if (VarTitle.length > 0)
    {
      VarTitle += WWHFrame.WWHHelp.mMessages.mAccessibilityListSeparator + " ";
    }
    VarTitle += this.fGetControl("WWHSyncTOCIcon").fGetLabel();
  }

  if (this.fGetControl("WWHPrevIcon").fGetLabel().length > 0)
  {
    if (VarTitle.length > 0)
    {
      VarTitle += WWHFrame.WWHHelp.mMessages.mAccessibilityListSeparator + " ";
    }
    VarTitle += this.fGetControl("WWHPrevIcon").fGetLabel();
  }

  if (this.fGetControl("WWHNextIcon").fGetLabel().length > 0)
  {
    if (VarTitle.length > 0)
    {
      VarTitle += WWHFrame.WWHHelp.mMessages.mAccessibilityListSeparator + " ";
    }
    VarTitle += this.fGetControl("WWHNextIcon").fGetLabel();
  }

  return VarTitle;
}

function  WWHControls_RightFrameTitle()
{
  var  VarTitle = "";


  if (this.fGetControl("WWHPDFIcon").fGetLabel().length > 0)
  {
    if (VarTitle.length > 0)
    {
      VarTitle += WWHFrame.WWHHelp.mMessages.mAccessibilityListSeparator + " ";
    }
    VarTitle += this.fGetControl("WWHPDFIcon").fGetLabel();
  }

  if (this.fGetControl("WWHRelatedTopicsIcon").fGetLabel().length > 0)
  {
    if (VarTitle.length > 0)
    {
      VarTitle += WWHFrame.WWHHelp.mMessages.mAccessibilityListSeparator + " ";
    }
    VarTitle += this.fGetControl("WWHRelatedTopicsIcon").fGetLabel();
  }

  if (this.fGetControl("WWHEmailIcon").fGetLabel().length > 0)
  {
    if (VarTitle.length > 0)
    {
      VarTitle += WWHFrame.WWHHelp.mMessages.mAccessibilityListSeparator + " ";
    }
    VarTitle += this.fGetControl("WWHEmailIcon").fGetLabel();
  }

  if (this.fGetControl("WWHPrintIcon").fGetLabel().length > 0)
  {
    if (VarTitle.length > 0)
    {
      VarTitle += WWHFrame.WWHHelp.mMessages.mAccessibilityListSeparator + " ";
    }
    VarTitle += this.fGetControl("WWHPrintIcon").fGetLabel();
  }

  if (this.fGetControl("WWHBookmarkIcon").fGetLabel().length > 0)
  {
    if (VarTitle.length > 0)
    {
      VarTitle += WWHFrame.WWHHelp.mMessages.mAccessibilityListSeparator + " ";
    }
    VarTitle += this.fGetControl("WWHBookmarkIcon").fGetLabel();
  }

  return VarTitle;
}

function  WWHControls_UpdateHREF(ParamHREF)
{
  // Update sync/prev/next array
  //
  this.mSyncPrevNext = WWHFrame.WWHHelp.fGetSyncPrevNext(ParamHREF);

  // Update status
  //
  this.fGetControl("WWHFrameSetIcon").fSetStatus(this.fSansNavigation());
  this.fGetControl("WWHSyncTOCIcon").fSetStatus(this.fCanSyncTOC());
  this.fGetControl("WWHPrevIcon").fSetStatus(this.mSyncPrevNext[1] != null);
  this.fGetControl("WWHNextIcon").fSetStatus(this.mSyncPrevNext[2] != null);
  this.fGetControl("WWHPDFIcon").fSetStatus(this.fHasPDFLink());
  this.fGetControl("WWHRelatedTopicsIcon").fSetStatus(WWHFrame.WWHRelatedTopics.fHasRelatedTopics());
  this.fGetControl("WWHEmailIcon").fSetStatus(this.fCanSyncTOC());
  this.fGetControl("WWHPrintIcon").fSetStatus(this.fCanSyncTOC());
  this.fGetControl("WWHBookmarkIcon").fSetStatus(this.fCanSyncTOC());

  // Update controls
  //
  if (WWHFrame.WWHHelp.mbAccessible)
  {
    // Reload control frames
    //
    this.fReloadControls();
  }
  else
  {
    // Update icons in place
    //
    this.fGetControl("WWHFrameSetIcon").fUpdateIcon();
    this.fGetControl("WWHSyncTOCIcon").fUpdateIcon();
    this.fGetControl("WWHPrevIcon").fUpdateIcon();
    this.fGetControl("WWHNextIcon").fUpdateIcon();
    this.fGetControl("WWHPDFIcon").fUpdateIcon();
    this.fGetControl("WWHRelatedTopicsIcon").fUpdateIcon();
    this.fGetControl("WWHEmailIcon").fUpdateIcon();
    this.fGetControl("WWHPrintIcon").fUpdateIcon();
    this.fGetControl("WWHBookmarkIcon").fUpdateIcon();

    // Restore previous focus
    //
    this.fRestoreFocus();
  }
}

function  WWHControls_RecordFocus(ParamFrameName,
                                  ParamAnchorName)
{
  this.mFocusedFrame  = ParamFrameName;
  this.mFocusedAnchor = ParamAnchorName;
}

function  WWHControls_RestoreFocus()
{
  if ((this.mFocusedFrame.length > 0) &&
      (this.mFocusedAnchor.length > 0))
  {
    WWHFrame.WWHHelp.fFocus(this.mFocusedFrame, this.mFocusedAnchor);
  }

  this.mFocusedFrame  = "";
  this.mFocusedAnchor = "";
}

function  WWHControls_SwitchToNavigation(ParamTabName)
{
  var  VarDocumentFrame;
  var  VarDocumentURL;
  var  VarSwitchURL;


  // Switch to navigation
  //
  VarDocumentFrame = eval(WWHFrame.WWHHelp.fGetFrameReference("WWHDocumentFrame"));
  VarDocumentURL = WWHFrame.WWHBrowser.fNormalizeURL(VarDocumentFrame.location.href);
  VarDocumentURL = WWHFrame.WWHHelp.fGetBookFileHREF(VarDocumentURL);
  VarSwitchURL = WWHFrame.WWHHelp.mHelpURLPrefix + "/wwhelp/wwhimpl/common/html/switch.htm?href=" + VarDocumentURL;
  if (WWHFrame.WWHHelp.mbAccessible)
  {
    VarSwitchURL += "&accessible=true";
  }
  if ((typeof(ParamTabName) != "undefined") &&
      (ParamTabName != null))
  {
    VarSwitchURL += "&tab=" + ParamTabName;
  }
  WWHFrame.WWHSwitch.fExec(false, VarSwitchURL);
}

function  WWHControls_HasPDFLink()
{
  var  VarHasPDFLink = false;
  var  VarDocumentFrame;

  VarDocumentFrame = eval(WWHFrame.WWHHelp.fGetFrameReference("WWHDocumentFrame"));
  VarHasPDFLink = ((typeof VarDocumentFrame.WWHPDFLink) == "function");

  return VarHasPDFLink;
}

function  WWHControls_ClickedShowNavigation()
{
  this.fShowNavigation();
}

function  WWHControls_ClickedSyncTOC()
{
  this.fSyncTOC(true);
}

function  WWHControls_ClickedPrevious()
{
  // Record focused icon
  //
  this.fRecordFocus("WWHControlsLeftFrame", "WWHPrevIcon");

  this.fPrevious();
}

function  WWHControls_ClickedNext()
{
  // Record focused icon
  //
  this.fRecordFocus("WWHControlsLeftFrame", "WWHNextIcon");

  this.fNext();
}

function  WWHControls_ClickedPDF()
{
  this.fPDF();
}

function  WWHControls_ClickedRelatedTopics()
{
  this.fRelatedTopics();
}

function  WWHControls_ClickedEmail()
{
  this.fEmail();
}

function  WWHControls_ClickedPrint()
{
  this.fPrint();
}

function  WWHControls_ClickedBookmark()
{
  this.fBookmark();
}

function  WWHControls_ShowNavigation()
{
  var  VarDocumentFrame;
  var  VarDocumentURL;


  if (WWHFrame.WWHHandler.fIsReady())
  {
    this.fSwitchToNavigation();
  }
}

function  WWHControls_SyncTOC(bParamReportError)
{
  if (this.fCanSyncTOC())
  {
    if (WWHFrame.WWHHandler.fIsReady())
    {
      WWHFrame.WWHHelp.fSyncTOC(this.mSyncPrevNext[0], bParamReportError);
    }
  }
}

function  WWHControls_Previous()
{
  if (this.mSyncPrevNext[1] != null)
  {
    WWHFrame.WWHHelp.fSetDocumentHREF(this.mSyncPrevNext[1], false);
  }
}

function  WWHControls_Next()
{
  if (this.mSyncPrevNext[2] != null)
  {
    WWHFrame.WWHHelp.fSetDocumentHREF(this.mSyncPrevNext[2], false);
  }
}

function  WWHControls_PDF()
{
  var  VarDocumentFrame;
  var  VarDocumentURL;
  var  VarDocumentParentURL;
  var  VarPDFLink;
  var  VarPDFURL;

  VarDocumentFrame = eval(WWHFrame.WWHHelp.fGetFrameReference("WWHDocumentFrame"));
  if ((typeof VarDocumentFrame.WWHPDFLink) == "function")
  {
    VarIndex = VarDocumentFrame.location.href.lastIndexOf("/");
    VarDocumentParentURL = VarDocumentFrame.location.href.substring(0, VarIndex);
    VarPDFLink = VarDocumentFrame.WWHPDFLink();
    VarPDFURL = VarDocumentParentURL + "/" + VarPDFLink;

    WWHFrame.WWHHelp.fSetLocation("WWHDocumentFrame", VarPDFURL);
  }
}

function  WWHControls_RelatedTopics()
{
  var  VarDocumentFrame;
  var  VarDocumentURL;


  if (WWHFrame.WWHRelatedTopics.fHasRelatedTopics())
  {
    if (WWHFrame.WWHBrowser.mbSupportsPopups)
    {
      WWHFrame.WWHRelatedTopics.fShow();
    }
    else
    {
      VarDocumentFrame = eval(WWHFrame.WWHHelp.fGetFrameReference("WWHDocumentFrame"));

      VarDocumentURL = WWHFrame.WWHBrowser.fNormalizeURL(VarDocumentFrame.location.href);
      VarDocumentURL = WWHStringUtilities_GetURLFilePathOnly(VarDocumentURL);

      WWHFrame.WWHHelp.fSetLocation("WWHDocumentFrame", VarDocumentURL + "#WWHRelatedTopics");
    }
  }
}

function  WWHControls_Email()
{
  var  VarLocation;
  var  VarMessage;
  var  VarMailTo;


  //GUIDEWIRE MODIFIED
  if (this.fCanSyncTOC())
  {
    VarLocation = Guidewire_GetLongURL(this);
    var VarPageTitle=escape("Link to page \'" + WWHFrame.WWHHelp.fHREFToTitle(this.mSyncPrevNext[0]) + "\'");
    VarMessage = VarPageTitle + escape(" at URL ") + escape(VarLocation);
    VarMailTo = "mailto:?subject=" + VarPageTitle + "&body=" + VarMessage;

    WWHFrame.WWHHelp.fSetLocation("WWHDocumentFrame", VarMailTo);
  }
}

function  WWHControls_Print()
{
  var  VarDocumentFrame;


  if (this.fCanSyncTOC())
  {
    VarDocumentFrame = eval(WWHFrame.WWHHelp.fGetFrameReference("WWHDocumentFrame"));

    VarDocumentFrame.focus();
    VarDocumentFrame.print();
  }
}

function  WWHControls_Bookmark()
{
  var  BookmarkData;
  var  VarWindow;


  if (this.fCanSyncTOC())
  {
    BookmarkData = this.fBookmarkData();
    if ((BookmarkData[0] != null) &&
        (BookmarkData[1] != null))
    {

    var varMyURL = Guidewire_GetLongURL(this);
    var varMyTitle = WWHFrame.WWHHelp.fHREFToTitle(this.mSyncPrevNext[0]);
    Guidewire_LinkToThis_Toggle( varMyURL , varMyTitle  );
    }
  }
}

function  WWHControls_BookmarkData()
{
  var  BookmarkData = new Array(null, null, null);
  var  DocumentURL;
  var  DocumentTitle;
  var  VarQuote;
  var  ResetEverything;
  var  DocumentBookmarkURL;


  if (this.fCanSyncTOC())
  {
    // Determine bookmark link
    //
    DocumentURL = WWHFrame.WWHHelp.fGetBookFileHREF(this.mSyncPrevNext[0]);
    if (DocumentURL != null)
    {
      DocumentTitle = WWHFrame.WWHHelp.fHREFToTitle(this.mSyncPrevNext[0]);

      if (WWHFrame.WWHBrowser.mBrowser == 1)  // Shorthand for Netscape
      {
        VarQuote = "&quot;";
      }
      else
      {
        VarQuote = "%22";
      }

      DocumentBookmarkURL = WWHFrame.WWHHelp.mHelpURLPrefix + "wwhelp/wwhimpl/api.htm?href=" + DocumentURL;
      //if (this.fSansNavigation())
      //{ 
      //  DocumentBookmarkURL += "&single=true"
      //}

      // Set bookmark data
      //
      BookmarkData[0] = DocumentTitle;
      BookmarkData[1] = DocumentBookmarkURL;
      BookmarkData[2] = DocumentBookmarkURL;
    }
  }

  return BookmarkData;
}

function  WWHControls_BookmarkLink()
{
  var  BookmarkLink = "";
  var  BookmarkData = this.fBookmarkData();


  if ((BookmarkData[0] != null) &&
      (BookmarkData[1] != null))
  {
    BookmarkLink = "<a href=\"" + BookmarkData[1] + "\">" + BookmarkData[0] + "</a>";
    BookmarkLink = BookmarkLink + "<p>Direct URL to send customer support:<br><a href=\""+ BookmarkData[2] + "\">" + BookmarkData[2]  + "</a>"; 
  }

  return BookmarkLink;
}

function  WWHControls_ProcessAccessKey(ParamAccessKey)
{
  switch (ParamAccessKey)
  {
    case 4:
      this.fClickedPrevious();
      break;

    case 5:
      this.fClickedNext();
      break;

    case 6:
      this.fClickedRelatedTopics();
      break;

    case 7:
      this.fClickedEmail();
      break;

    case 8:
      this.fClickedPrint();
      break;

    case 9:
      this.fClickedBookmark();
      break;
  }
}
