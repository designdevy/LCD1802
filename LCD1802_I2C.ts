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
    let i2cAddr: number // 62: JHD1802
    let BK: number      // backlight control
    let RS: number      // command/data

    // set LCD reg
    function setreg(d: number) {
        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE)
        basic.pause(1)
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
        RS = 0
        set(d)
        set(d << 4)
    }

    // send data
    function dat(d: number) {
        RS = 1
        set(d)
        set(d << 4)
    }

    // auto get LCD address
    function AutoAddr() {
        let k = true
        let addr = 0x20
        let d1 = 0, d2 = 0
        while (k && (addr < 0x28)) {
            pins.i2cWriteNumber(addr, -1, NumberFormat.Int32LE)
            d1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE) % 16
            pins.i2cWriteNumber(addr, 0, NumberFormat.Int16LE)
            d2 = pins.i2cReadNumber(addr, NumberFormat.Int8LE)
            if ((d1 == 7) && (d2 == 0)) k = false
            else addr += 1
        }
        if (!k) return addr

        addr = 0x38
        while (k && (addr < 0x40)) {
            pins.i2cWriteNumber(addr, -1, NumberFormat.Int32LE)
            d1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE) % 16
            pins.i2cWriteNumber(addr, 0, NumberFormat.Int16LE)
            d2 = pins.i2cReadNumber(addr, NumberFormat.Int8LE)
            if ((d1 == 7) && (d2 == 0)) k = false
            else addr += 1
        }
        if (!k) return addr
        else return 0

    }

    /**
     * initial LCD, set I2C address. Address is 0x3E
     */
    //% blockId="LCD1802_SET_ADDRESS" block="LCD initialize" | %address
    //% address.min=60 address.max=70 address.defl=62 
    //% weight=100 blockGap=8
    //% parts=LCD1802_I2C trackArgs=0
    export function LcdInit(address : number) : void {
        i2cAddr = address
        BK = 8
        RS = 0
        cmd(0x33)       // set 4bit mode
        basic.pause(5)
        set(0x30)
        basic.pause(5)
        set(0x20)
        basic.pause(5)
        cmd(0x28)       // set mode
        cmd(0x0C)
        cmd(0x06)
        cmd(0x01)       // clear
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

        if (y > 0)
            a = 0xC0
        else
            a = 0x80
        a += x
        cmd(a)

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