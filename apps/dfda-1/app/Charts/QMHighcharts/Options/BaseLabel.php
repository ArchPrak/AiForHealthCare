<?php
/*
*  GNU General Public License v3.0
*  Contributors: ADD YOUR NAME HERE, Mike P. Sinn
 */

namespace App\Charts\QMHighcharts\Options;
use App\Charts\QMHighcharts\HighchartOption;
class BaseLabel extends HighchartOption {
	/**
	 * @var string
	 * @link https://api.highcharts.com/highcharts/baseLabel.text
	 */
	public $text;
	/**
	 * @var BaseStyle
	 * @link https://api.highcharts.com/highcharts/style
	 */
	public $style;
	/**
	 * @var string
	 * @link https://api.highcharts.com/highcharts/baseLabel.align
	 */
	public $align;
	public function __construct(){
		parent::__construct();
		//$this->style = new BaseStyle(); Don't set this or it json encodes to empty array and breaks charts
	}
}
