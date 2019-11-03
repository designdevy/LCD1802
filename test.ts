let item = 0
LCD1802.LcdInit(0)
LCD1802.ShowString("Hello", 0, 0)
basic.forever(() => {
    item += 1
    LCD1802.ShowNumber(item, 0, 1)
    basic.pause(1000)
})
