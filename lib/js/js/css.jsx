// http://www.w3.org/TR/DOM-Level-2-Style/

native class CSSStyleSheet {

}

native class CSSRuleList {

}

native class CSSRule {
	// TODO
}

native class CSSStyleRule extends CSSRule {
	// TODO
}

native class CSSMediaRule extends CSSRule {
	// TODO
}

native class CSSFontFaceRule extends CSSRule {
	// TODO
}

native class CSSPageRule extends CSSRule {
	// TODO
}

native class CSSImportRule extends CSSRule {
	// TODO
}

native class CSSCharsetRule extends CSSRule {
	// TODO
}

native class CSSUnknownRule extends CSSRule {
	// TODO
}

native class CSSValue {
	// TODO
}

native class CSSPrimitiveValue extends CSSValue {
	// TODO
}

native class CSSValueList extends CSSValue {
	// TODO
}

native class RGBColor {
	const red : CSSPrimitiveValue;
	const green : CSSPrimitiveValue;
	const blue : CSSPrimitiveValue;
}

native class Rect {
	// TODO
}

native class Counter {
	// TODO
}

native class CSSStyleDeclaration {
	function getPropertyValue(propertyName : string) : string;
	function getPropertyCSSValue(propertyName : string) : CSSValue;
	function removePropertyValue(propertyName : string) : string;
	function getPropertyPriority(propertyName : string) : string;
	function setProperty(propertyName : string, value : string) : void;
	function setProperty(propertyName : string, value : string, priority : string) : void;
	function item(index : int) : string;

	// auto-generated properties:
	// (function(style) { var a = []; for(var k in style) { if(typeof style[k] === "function") continue; a.push("var "+k+" : MayBeUndefined.<"+(typeof style[k])+">;"+String.fromCharCode(0x0a)) }; return a.sort().join(""); }(document.body.style))

	// Chrome 18

	var alignmentBaseline : MayBeUndefined.<string>;
	var background : MayBeUndefined.<string>;
	var backgroundAttachment : MayBeUndefined.<string>;
	var backgroundClip : MayBeUndefined.<string>;
	var backgroundColor : MayBeUndefined.<string>;
	var backgroundImage : MayBeUndefined.<string>;
	var backgroundOrigin : MayBeUndefined.<string>;
	var backgroundPosition : MayBeUndefined.<string>;
	var backgroundPositionX : MayBeUndefined.<string>;
	var backgroundPositionY : MayBeUndefined.<string>;
	var backgroundRepeat : MayBeUndefined.<string>;
	var backgroundRepeatX : MayBeUndefined.<string>;
	var backgroundRepeatY : MayBeUndefined.<string>;
	var backgroundSize : MayBeUndefined.<string>;
	var baselineShift : MayBeUndefined.<string>;
	var border : MayBeUndefined.<string>;
	var borderBottom : MayBeUndefined.<string>;
	var borderBottomColor : MayBeUndefined.<string>;
	var borderBottomLeftRadius : MayBeUndefined.<string>;
	var borderBottomRightRadius : MayBeUndefined.<string>;
	var borderBottomStyle : MayBeUndefined.<string>;
	var borderBottomWidth : MayBeUndefined.<string>;
	var borderCollapse : MayBeUndefined.<string>;
	var borderColor : MayBeUndefined.<string>;
	var borderImage : MayBeUndefined.<string>;
	var borderImageOutset : MayBeUndefined.<string>;
	var borderImageRepeat : MayBeUndefined.<string>;
	var borderImageSlice : MayBeUndefined.<string>;
	var borderImageSource : MayBeUndefined.<string>;
	var borderImageWidth : MayBeUndefined.<string>;
	var borderLeft : MayBeUndefined.<string>;
	var borderLeftColor : MayBeUndefined.<string>;
	var borderLeftStyle : MayBeUndefined.<string>;
	var borderLeftWidth : MayBeUndefined.<string>;
	var borderRadius : MayBeUndefined.<string>;
	var borderRight : MayBeUndefined.<string>;
	var borderRightColor : MayBeUndefined.<string>;
	var borderRightStyle : MayBeUndefined.<string>;
	var borderRightWidth : MayBeUndefined.<string>;
	var borderSpacing : MayBeUndefined.<string>;
	var borderStyle : MayBeUndefined.<string>;
	var borderTop : MayBeUndefined.<string>;
	var borderTopColor : MayBeUndefined.<string>;
	var borderTopLeftRadius : MayBeUndefined.<string>;
	var borderTopRightRadius : MayBeUndefined.<string>;
	var borderTopStyle : MayBeUndefined.<string>;
	var borderTopWidth : MayBeUndefined.<string>;
	var borderWidth : MayBeUndefined.<string>;
	var bottom : MayBeUndefined.<string>;
	var boxShadow : MayBeUndefined.<string>;
	var boxSizing : MayBeUndefined.<string>;
	var captionSide : MayBeUndefined.<string>;
	var clear : MayBeUndefined.<string>;
	var clip : MayBeUndefined.<string>;
	var clipPath : MayBeUndefined.<string>;
	var clipRule : MayBeUndefined.<string>;
	var color : MayBeUndefined.<string>;
	var colorInterpolation : MayBeUndefined.<string>;
	var colorInterpolationFilters : MayBeUndefined.<string>;
	var colorProfile : MayBeUndefined.<string>;
	var colorRendering : MayBeUndefined.<string>;
	var content : MayBeUndefined.<string>;
	var counterIncrement : MayBeUndefined.<string>;
	var counterReset : MayBeUndefined.<string>;
	var cssText : MayBeUndefined.<string>;
	var cursor : MayBeUndefined.<string>;
	var direction : MayBeUndefined.<string>;
	var display : MayBeUndefined.<string>;
	var dominantBaseline : MayBeUndefined.<string>;
	var emptyCells : MayBeUndefined.<string>;
	var enableBackground : MayBeUndefined.<string>;
	var fill : MayBeUndefined.<string>;
	var fillOpacity : MayBeUndefined.<string>;
	var fillRule : MayBeUndefined.<string>;
	var filter : MayBeUndefined.<string>;
	var float : MayBeUndefined.<string>;
	var floodColor : MayBeUndefined.<string>;
	var floodOpacity : MayBeUndefined.<string>;
	var font : MayBeUndefined.<string>;
	var fontFamily : MayBeUndefined.<string>;
	var fontSize : MayBeUndefined.<string>;
	var fontStretch : MayBeUndefined.<string>;
	var fontStyle : MayBeUndefined.<string>;
	var fontVariant : MayBeUndefined.<string>;
	var fontWeight : MayBeUndefined.<string>;
	var glyphOrientationHorizontal : MayBeUndefined.<string>;
	var glyphOrientationVertical : MayBeUndefined.<string>;
	var height : MayBeUndefined.<string>;
	var imageRendering : MayBeUndefined.<string>;
	var kerning : MayBeUndefined.<string>;
	var left : MayBeUndefined.<string>;
	var length : MayBeUndefined.<number>;
	var letterSpacing : MayBeUndefined.<string>;
	var lightingColor : MayBeUndefined.<string>;
	var lineHeight : MayBeUndefined.<string>;
	var listStyle : MayBeUndefined.<string>;
	var listStyleImage : MayBeUndefined.<string>;
	var listStylePosition : MayBeUndefined.<string>;
	var listStyleType : MayBeUndefined.<string>;
	var margin : MayBeUndefined.<string>;
	var marginBottom : MayBeUndefined.<string>;
	var marginLeft : MayBeUndefined.<string>;
	var marginRight : MayBeUndefined.<string>;
	var marginTop : MayBeUndefined.<string>;
	var marker : MayBeUndefined.<string>;
	var markerEnd : MayBeUndefined.<string>;
	var markerMid : MayBeUndefined.<string>;
	var markerStart : MayBeUndefined.<string>;
	var mask : MayBeUndefined.<string>;
	var maxHeight : MayBeUndefined.<string>;
	var maxWidth : MayBeUndefined.<string>;
	var minHeight : MayBeUndefined.<string>;
	var minWidth : MayBeUndefined.<string>;
	var opacity : MayBeUndefined.<string>;
	var orphans : MayBeUndefined.<string>;
	var outline : MayBeUndefined.<string>;
	var outlineColor : MayBeUndefined.<string>;
	var outlineOffset : MayBeUndefined.<string>;
	var outlineStyle : MayBeUndefined.<string>;
	var outlineWidth : MayBeUndefined.<string>;
	var overflow : MayBeUndefined.<string>;
	var overflowX : MayBeUndefined.<string>;
	var overflowY : MayBeUndefined.<string>;
	var padding : MayBeUndefined.<string>;
	var paddingBottom : MayBeUndefined.<string>;
	var paddingLeft : MayBeUndefined.<string>;
	var paddingRight : MayBeUndefined.<string>;
	var paddingTop : MayBeUndefined.<string>;
	var page : MayBeUndefined.<string>;
	var pageBreakAfter : MayBeUndefined.<string>;
	var pageBreakBefore : MayBeUndefined.<string>;
	var pageBreakInside : MayBeUndefined.<string>;
	var parentRule : MayBeUndefined.<Object>;
	var pointerEvents : MayBeUndefined.<string>;
	var position : MayBeUndefined.<string>;
	var quotes : MayBeUndefined.<string>;
	var resize : MayBeUndefined.<string>;
	var right : MayBeUndefined.<string>;
	var shapeRendering : MayBeUndefined.<string>;
	var size : MayBeUndefined.<string>;
	var speak : MayBeUndefined.<string>;
	var src : MayBeUndefined.<string>;
	var stopColor : MayBeUndefined.<string>;
	var stopOpacity : MayBeUndefined.<string>;
	var stroke : MayBeUndefined.<string>;
	var strokeDasharray : MayBeUndefined.<string>;
	var strokeDashoffset : MayBeUndefined.<string>;
	var strokeLinecap : MayBeUndefined.<string>;
	var strokeLinejoin : MayBeUndefined.<string>;
	var strokeMiterlimit : MayBeUndefined.<string>;
	var strokeOpacity : MayBeUndefined.<string>;
	var strokeWidth : MayBeUndefined.<string>;
	var tableLayout : MayBeUndefined.<string>;
	var textAlign : MayBeUndefined.<string>;
	var textAnchor : MayBeUndefined.<string>;
	var textDecoration : MayBeUndefined.<string>;
	var textIndent : MayBeUndefined.<string>;
	var textLineThrough : MayBeUndefined.<string>;
	var textLineThroughColor : MayBeUndefined.<string>;
	var textLineThroughMode : MayBeUndefined.<string>;
	var textLineThroughStyle : MayBeUndefined.<string>;
	var textLineThroughWidth : MayBeUndefined.<string>;
	var textOverflow : MayBeUndefined.<string>;
	var textOverline : MayBeUndefined.<string>;
	var textOverlineColor : MayBeUndefined.<string>;
	var textOverlineMode : MayBeUndefined.<string>;
	var textOverlineStyle : MayBeUndefined.<string>;
	var textOverlineWidth : MayBeUndefined.<string>;
	var textRendering : MayBeUndefined.<string>;
	var textShadow : MayBeUndefined.<string>;
	var textTransform : MayBeUndefined.<string>;
	var textUnderline : MayBeUndefined.<string>;
	var textUnderlineColor : MayBeUndefined.<string>;
	var textUnderlineMode : MayBeUndefined.<string>;
	var textUnderlineStyle : MayBeUndefined.<string>;
	var textUnderlineWidth : MayBeUndefined.<string>;
	var top : MayBeUndefined.<string>;
	var unicodeBidi : MayBeUndefined.<string>;
	var unicodeRange : MayBeUndefined.<string>;
	var vectorEffect : MayBeUndefined.<string>;
	var verticalAlign : MayBeUndefined.<string>;
	var visibility : MayBeUndefined.<string>;
	var webkitAnimation : MayBeUndefined.<string>;
	var webkitAnimationDelay : MayBeUndefined.<string>;
	var webkitAnimationDirection : MayBeUndefined.<string>;
	var webkitAnimationDuration : MayBeUndefined.<string>;
	var webkitAnimationFillMode : MayBeUndefined.<string>;
	var webkitAnimationIterationCount : MayBeUndefined.<string>;
	var webkitAnimationName : MayBeUndefined.<string>;
	var webkitAnimationPlayState : MayBeUndefined.<string>;
	var webkitAnimationTimingFunction : MayBeUndefined.<string>;
	var webkitAppearance : MayBeUndefined.<string>;
	var webkitAspectRatio : MayBeUndefined.<string>;
	var webkitBackfaceVisibility : MayBeUndefined.<string>;
	var webkitBackgroundClip : MayBeUndefined.<string>;
	var webkitBackgroundComposite : MayBeUndefined.<string>;
	var webkitBackgroundOrigin : MayBeUndefined.<string>;
	var webkitBackgroundSize : MayBeUndefined.<string>;
	var webkitBorderAfter : MayBeUndefined.<string>;
	var webkitBorderAfterColor : MayBeUndefined.<string>;
	var webkitBorderAfterStyle : MayBeUndefined.<string>;
	var webkitBorderAfterWidth : MayBeUndefined.<string>;
	var webkitBorderBefore : MayBeUndefined.<string>;
	var webkitBorderBeforeColor : MayBeUndefined.<string>;
	var webkitBorderBeforeStyle : MayBeUndefined.<string>;
	var webkitBorderBeforeWidth : MayBeUndefined.<string>;
	var webkitBorderEnd : MayBeUndefined.<string>;
	var webkitBorderEndColor : MayBeUndefined.<string>;
	var webkitBorderEndStyle : MayBeUndefined.<string>;
	var webkitBorderEndWidth : MayBeUndefined.<string>;
	var webkitBorderFit : MayBeUndefined.<string>;
	var webkitBorderHorizontalSpacing : MayBeUndefined.<string>;
	var webkitBorderImage : MayBeUndefined.<string>;
	var webkitBorderRadius : MayBeUndefined.<string>;
	var webkitBorderStart : MayBeUndefined.<string>;
	var webkitBorderStartColor : MayBeUndefined.<string>;
	var webkitBorderStartStyle : MayBeUndefined.<string>;
	var webkitBorderStartWidth : MayBeUndefined.<string>;
	var webkitBorderVerticalSpacing : MayBeUndefined.<string>;
	var webkitBoxAlign : MayBeUndefined.<string>;
	var webkitBoxDirection : MayBeUndefined.<string>;
	var webkitBoxFlex : MayBeUndefined.<string>;
	var webkitBoxFlexGroup : MayBeUndefined.<string>;
	var webkitBoxLines : MayBeUndefined.<string>;
	var webkitBoxOrdinalGroup : MayBeUndefined.<string>;
	var webkitBoxOrient : MayBeUndefined.<string>;
	var webkitBoxPack : MayBeUndefined.<string>;
	var webkitBoxReflect : MayBeUndefined.<string>;
	var webkitBoxShadow : MayBeUndefined.<string>;
	var webkitColorCorrection : MayBeUndefined.<string>;
	var webkitColumnAxis : MayBeUndefined.<string>;
	var webkitColumnBreakAfter : MayBeUndefined.<string>;
	var webkitColumnBreakBefore : MayBeUndefined.<string>;
	var webkitColumnBreakInside : MayBeUndefined.<string>;
	var webkitColumnCount : MayBeUndefined.<string>;
	var webkitColumnGap : MayBeUndefined.<string>;
	var webkitColumnRule : MayBeUndefined.<string>;
	var webkitColumnRuleColor : MayBeUndefined.<string>;
	var webkitColumnRuleStyle : MayBeUndefined.<string>;
	var webkitColumnRuleWidth : MayBeUndefined.<string>;
	var webkitColumnSpan : MayBeUndefined.<string>;
	var webkitColumnWidth : MayBeUndefined.<string>;
	var webkitColumns : MayBeUndefined.<string>;
	var webkitFlexAlign : MayBeUndefined.<string>;
	var webkitFlexDirection : MayBeUndefined.<string>;
	var webkitFlexFlow : MayBeUndefined.<string>;
	var webkitFlexItemAlign : MayBeUndefined.<string>;
	var webkitFlexOrder : MayBeUndefined.<string>;
	var webkitFlexPack : MayBeUndefined.<string>;
	var webkitFlexWrap : MayBeUndefined.<string>;
	var webkitFlowFrom : MayBeUndefined.<string>;
	var webkitFlowInto : MayBeUndefined.<string>;
	var webkitFontFeatureSettings : MayBeUndefined.<string>;
	var webkitFontKerning : MayBeUndefined.<string>;
	var webkitFontSizeDelta : MayBeUndefined.<string>;
	var webkitFontSmoothing : MayBeUndefined.<string>;
	var webkitFontVariantLigatures : MayBeUndefined.<string>;
	var webkitHighlight : MayBeUndefined.<string>;
	var webkitHyphenateCharacter : MayBeUndefined.<string>;
	var webkitHyphenateLimitAfter : MayBeUndefined.<string>;
	var webkitHyphenateLimitBefore : MayBeUndefined.<string>;
	var webkitHyphenateLimitLines : MayBeUndefined.<string>;
	var webkitHyphens : MayBeUndefined.<string>;
	var webkitLineBoxContain : MayBeUndefined.<string>;
	var webkitLineBreak : MayBeUndefined.<string>;
	var webkitLineClamp : MayBeUndefined.<string>;
	var webkitLineGrid : MayBeUndefined.<string>;
	var webkitLineGridSnap : MayBeUndefined.<string>;
	var webkitLocale : MayBeUndefined.<string>;
	var webkitLogicalHeight : MayBeUndefined.<string>;
	var webkitLogicalWidth : MayBeUndefined.<string>;
	var webkitMarginAfter : MayBeUndefined.<string>;
	var webkitMarginAfterCollapse : MayBeUndefined.<string>;
	var webkitMarginBefore : MayBeUndefined.<string>;
	var webkitMarginBeforeCollapse : MayBeUndefined.<string>;
	var webkitMarginBottomCollapse : MayBeUndefined.<string>;
	var webkitMarginCollapse : MayBeUndefined.<string>;
	var webkitMarginEnd : MayBeUndefined.<string>;
	var webkitMarginStart : MayBeUndefined.<string>;
	var webkitMarginTopCollapse : MayBeUndefined.<string>;
	var webkitMarquee : MayBeUndefined.<string>;
	var webkitMarqueeDirection : MayBeUndefined.<string>;
	var webkitMarqueeIncrement : MayBeUndefined.<string>;
	var webkitMarqueeRepetition : MayBeUndefined.<string>;
	var webkitMarqueeSpeed : MayBeUndefined.<string>;
	var webkitMarqueeStyle : MayBeUndefined.<string>;
	var webkitMask : MayBeUndefined.<string>;
	var webkitMaskAttachment : MayBeUndefined.<string>;
	var webkitMaskBoxImage : MayBeUndefined.<string>;
	var webkitMaskBoxImageOutset : MayBeUndefined.<string>;
	var webkitMaskBoxImageRepeat : MayBeUndefined.<string>;
	var webkitMaskBoxImageSlice : MayBeUndefined.<string>;
	var webkitMaskBoxImageSource : MayBeUndefined.<string>;
	var webkitMaskBoxImageWidth : MayBeUndefined.<string>;
	var webkitMaskClip : MayBeUndefined.<string>;
	var webkitMaskComposite : MayBeUndefined.<string>;
	var webkitMaskImage : MayBeUndefined.<string>;
	var webkitMaskOrigin : MayBeUndefined.<string>;
	var webkitMaskPosition : MayBeUndefined.<string>;
	var webkitMaskPositionX : MayBeUndefined.<string>;
	var webkitMaskPositionY : MayBeUndefined.<string>;
	var webkitMaskRepeat : MayBeUndefined.<string>;
	var webkitMaskRepeatX : MayBeUndefined.<string>;
	var webkitMaskRepeatY : MayBeUndefined.<string>;
	var webkitMaskSize : MayBeUndefined.<string>;
	var webkitMatchNearestMailBlockquoteColor : MayBeUndefined.<string>;
	var webkitMaxLogicalHeight : MayBeUndefined.<string>;
	var webkitMaxLogicalWidth : MayBeUndefined.<string>;
	var webkitMinLogicalHeight : MayBeUndefined.<string>;
	var webkitMinLogicalWidth : MayBeUndefined.<string>;
	var webkitNbspMode : MayBeUndefined.<string>;
	var webkitPaddingAfter : MayBeUndefined.<string>;
	var webkitPaddingBefore : MayBeUndefined.<string>;
	var webkitPaddingEnd : MayBeUndefined.<string>;
	var webkitPaddingStart : MayBeUndefined.<string>;
	var webkitPerspective : MayBeUndefined.<string>;
	var webkitPerspectiveOrigin : MayBeUndefined.<string>;
	var webkitPerspectiveOriginX : MayBeUndefined.<string>;
	var webkitPerspectiveOriginY : MayBeUndefined.<string>;
	var webkitPrintColorAdjust : MayBeUndefined.<string>;
	var webkitRegionBreakAfter : MayBeUndefined.<string>;
	var webkitRegionBreakBefore : MayBeUndefined.<string>;
	var webkitRegionBreakInside : MayBeUndefined.<string>;
	var webkitRegionOverflow : MayBeUndefined.<string>;
	var webkitRtlOrdering : MayBeUndefined.<string>;
	var webkitSvgShadow : MayBeUndefined.<string>;
	var webkitTapHighlightColor : MayBeUndefined.<string>;
	var webkitTextCombine : MayBeUndefined.<string>;
	var webkitTextDecorationsInEffect : MayBeUndefined.<string>;
	var webkitTextEmphasis : MayBeUndefined.<string>;
	var webkitTextEmphasisColor : MayBeUndefined.<string>;
	var webkitTextEmphasisPosition : MayBeUndefined.<string>;
	var webkitTextEmphasisStyle : MayBeUndefined.<string>;
	var webkitTextFillColor : MayBeUndefined.<string>;
	var webkitTextOrientation : MayBeUndefined.<string>;
	var webkitTextSecurity : MayBeUndefined.<string>;
	var webkitTextSizeAdjust : MayBeUndefined.<string>;
	var webkitTextStroke : MayBeUndefined.<string>;
	var webkitTextStrokeColor : MayBeUndefined.<string>;
	var webkitTextStrokeWidth : MayBeUndefined.<string>;
	var webkitTransform : MayBeUndefined.<string>;
	var webkitTransformOrigin : MayBeUndefined.<string>;
	var webkitTransformOriginX : MayBeUndefined.<string>;
	var webkitTransformOriginY : MayBeUndefined.<string>;
	var webkitTransformOriginZ : MayBeUndefined.<string>;
	var webkitTransformStyle : MayBeUndefined.<string>;
	var webkitTransition : MayBeUndefined.<string>;
	var webkitTransitionDelay : MayBeUndefined.<string>;
	var webkitTransitionDuration : MayBeUndefined.<string>;
	var webkitTransitionProperty : MayBeUndefined.<string>;
	var webkitTransitionTimingFunction : MayBeUndefined.<string>;
	var webkitUserDrag : MayBeUndefined.<string>;
	var webkitUserModify : MayBeUndefined.<string>;
	var webkitUserSelect : MayBeUndefined.<string>;
	var webkitWrap : MayBeUndefined.<string>;
	var webkitWrapFlow : MayBeUndefined.<string>;
	var webkitWrapMargin : MayBeUndefined.<string>;
	var webkitWrapPadding : MayBeUndefined.<string>;
	var webkitWrapShapeInside : MayBeUndefined.<string>;
	var webkitWrapShapeOutside : MayBeUndefined.<string>;
	var webkitWrapThrough : MayBeUndefined.<string>;
	var webkitWritingMode : MayBeUndefined.<string>;
	var whiteSpace : MayBeUndefined.<string>;
	var widows : MayBeUndefined.<string>;
	var width : MayBeUndefined.<string>;
	var wordBreak : MayBeUndefined.<string>;
	var wordSpacing : MayBeUndefined.<string>;
	var wordWrap : MayBeUndefined.<string>;
	var writingMode : MayBeUndefined.<string>;
	var zIndex : MayBeUndefined.<string>;
	var zoom : MayBeUndefined.<string>;
}
