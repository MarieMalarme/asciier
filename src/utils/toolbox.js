export const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const get_random_hex_color = () => {
  const random_color = Math.floor(Math.random() * 16777215).toString(16)
  return `#${random_color.padEnd(6, 0)}`
}

export const ascii_characters = `~!@⌗$%&*()-+={}[]|\\'":/.><0⌾⌘▓▢▣▤▥▦▧▨▩▪▮▯☰☷◧◨◩◪◫⊞⊟⊠⊡〓◊◈◇◆⎔◄▲▼►⫷⫸◭◮⋖⋗┅┋║╬◉○◌◍●◐◑◒◓✦✧✢✤✲✴✶✷✸✹✺✽✾✿❁❉❋`
