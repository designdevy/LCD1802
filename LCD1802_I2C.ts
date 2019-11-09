/**
* makecode LCD1802 package for microbit.
* From microbit/micropython Chinese community.
* http://www.micropython.org.cn
*/

/**
 * Custom blocks
 */
//% weight=20 color=#0fbc11 icon="▀"
namespace LCD1802 {
    // commands
    let  lines: number = 2;
    let  rows: number = 16;

    let _displayfunction : number;
    let _displaycontrol: number;
    let _displaymode: number;;
  
    let  LCD_CLEARDISPLAY: number= 0x01;
    let  LCD_RETURNHOME: number= 0x02;
    let  LCD_ENTRYMODESET: number= 0x04;
    let  LCD_DISPLAYCONTROL: number= 0x08;
    let  LCD_CURSORSHIFT: number= 0x10;
    let  LCD_FUNCTIONSET: number= 0x20;
    let  LCD_SETCGRAMADDR: number= 0x40;
    let  LCD_SETDDRAMADDR: number= 0x80;

    // flags for display entry mode
    let  LCD_ENTRYRIGHT: number= 0x00;
    let  LCD_ENTRYLEFT: number= 0x02;
    let  LCD_ENTRYSHIFTINCREMENT: number= 0x01;
    let  LCD_ENTRYSHIFTDECREMENT: number= 0x00;

    // flags for display on/off control
    let  LCD_DISPLAYON: number= 0x04;
    let  LCD_DISPLAYOFF: number= 0x00;
    let  LCD_CURSORON: number= 0x02;
    let  LCD_CURSOROFF: number= 0x00;
    let  LCD_BLINKON: number= 0x01;
    let  LCD_BLINKOFF: number= 0x00;

    // flags for display/cursor shift
    let  LCD_DISPLAYMOVE: number= 0x08;
    let  LCD_CURSORMOVE: number= 0x00;
    let  LCD_MOVERIGHT: number= 0x04;
    let  LCD_MOVELEFT: number= 0x00;

    // flags for function set
    let  LCD_8BITMODE: number= 0x10;
    let  LCD_4BITMODE: number= 0x00;
    let  LCD_2LINE: number= 0x08;
    let  LCD_1LINE: number= 0x00;
    let  LCD_5x10DOTS: number= 0x04;
    let  LCD_5x8DOTS: number= 0x00;

    
    let i2cAddr: number = 62; // 62: JHD1802
    let BK: number      // backlight control
    let RS: number      // command/data

    // set LCD reg
    function setreg(d: number) {
        let buf = pins.createBuffer(2);
        buf[0] = 0x80;
        buf[1] = d;
        pins.i2cWriteBuffer(i2cAddr, buf, false);
        basic.pause(1);
    }

    // set LCD reg
    function setdat(d: number) {
            let buf = pins.createBuffer(2);
            buf[0] = 0x40;
            buf[1] = d;
            pins.i2cWriteBuffer(i2cAddr, buf, false);
            basic.pause(1);
    }
    
    // send data to I2C bus
    function set(d: number) {
        d = d & 0xF0
        d = d + BK + RS
        setreg(d)
        setreg(d + 4)
        setreg(d)
    }

    // send command
    function cmd(d: number) {
        setreg(d);
    }

    // send data
    function dat(d: number) {
        setdat(d);
    }

    
    /**
     * initial LCD, set I2C address. Address is 0x3E
     */
    //% blockId="LCD1802_SET_ADDRESS" block="LCD initialize | %address"
    //% address.min=60 address.max=70 address.defl=62 
    //% weight=100 blockGap=8
    //% parts=LCD1802_I2C trackArgs=0
    export function LcdInit(address : number) : void {
        i2cAddr = address
        
        _displayfunction = LCD_2LINE;
        basic.pause(50);
        cmd(LCD_FUNCTIONSET | _displayfunction);
        basic.pause(5);
        cmd(LCD_FUNCTIONSET | _displayfunction);
        basic.pause(1);
        cmd(LCD_FUNCTIONSET | _displayfunction);
        basic.pause(1);
        cmd(LCD_FUNCTIONSET | _displayfunction);
        basic.pause(1);
        _displaycontrol = LCD_DISPLAYON | LCD_CURSOROFF | LCD_BLINKOFF;
        cmd(LCD_DISPLAYCONTROL | _displaycontrol);
        basic.pause(5);
        cmd(LCD_CLEARDISPLAY);
        basic.pause(2);
        _displaycontrol = LCD_ENTRYLEFT | LCD_ENTRYSHIFTDECREMENT;
        cmd(LCD_ENTRYMODESET | _displaycontrol);
    }

    /**
     * show a number in LCD at given position
     * @param n is number will be show, eg: 10, 100, 200
     * @param x is LCD column position, eg: 0
     * @param y is LCD row position, eg: 0
     */
    //% blockId="LCD1802_SHOW_NUMBER" block="show number %n|at x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% parts=LCD1802_I2C trackArgs=0
    export function ShowNumber(n: number, x: number, y: number): void {
        let s = n.toString()
        ShowString(s, x, y)
    }

    /**
     * show a string in LCD at given position
     * @param s is string will be show, eg: "Hello"
     * @param x is LCD column position, [0 - 15], eg: 0
     * @param y is LCD row position, [0 - 1], eg: 0
     */
    //% blockId="LCD1802_SHOW_STRING" block="show string %s|at x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% parts=LCD1802_I2C trackArgs=0
    export function ShowString(s: string, x: number, y: number): void {
        let a: number

        /*if (y > 0)
            a = 0xC0
        else
            a = 0x80
        a += x
        cmd(a)
*/
        for (let i = 0; i < s.length; i++) {
            dat(s.charCodeAt(i))
        }
    }

    /**
     * turn on LCD
     */
    //% blockId="LCD1802_ON" block="turn on LCD"
    //% weight=81 blockGap=8
    //% parts=LCD1802_I2C trackArgs=0
    export function on(): void {
        cmd(0x0C)
    }

    /**
     * turn off LCD
     */
    //% blockId="LCD1802_OFF" block="turn off LCD"
    //% weight=80 blockGap=8
    //% parts=LCD1802_I2C trackArgs=0
    export function off(): void {
        cmd(0x08)
    }

    /**
     * clear all display content
     */
    //% blockId="LCD1802_CLEAR" block="clear LCD"
    //% weight=85 blockGap=8
    //% parts=LCD1802_I2C trackArgs=0
    export function clear(): void {
        cmd(0x01)
    }

    /**
     * turn on LCD backlight
     */
    //% blockId="LCD1802_BACKLIGHT_ON" block="turn on backlight"
    //% weight=71 blockGap=8
    //% parts=LCD1802_I2C trackArgs=0
    export function BacklightOn(): void {
        BK = 8
        cmd(0)
    }

    /**
     * turn off LCD backlight
     */
    //% blockId="LCD1802_BACKLIGHT_OFF" block="turn off backlight"
    //% weight=70 blockGap=8
    //% parts=LCD1802_I2C trackArgs=0
    export function BacklightOff(): void {
        BK = 0
        cmd(0)
    }

    /**
     * shift left
     */
    //% blockId="LCD1802_SHL" block="Shift Left"
    //% weight=61 blockGap=8
    //% parts=LCD1802_I2C trackArgs=0
    export function shl(): void {
        cmd(0x18)
    }

    /**
     * shift right
     */
    //% blockId="LCD1802_SHR" block="Shift Right"
    //% weight=60 blockGap=8
    //% parts=LCD1802_I2C trackArgs=0
    export function shr(): void {
        cmd(0x1C)
    }
}