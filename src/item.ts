export type Props = {
  network: string
  space: string
  format: string
  style: string
  beacon: boolean
}

export default class ZestyBanner implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    const banner = new Entity(host.name + "-object")
    banner.setParent(host)

    const aspectRatio = new Vector3()
    switch (props.format) {
      case 'square':
        aspectRatio.set(1, 1, 1)
        break
      case 'tall':
        aspectRatio.set(.75, 1, 1)
        break
      case 'wide':
        aspectRatio.set(1, .25, 1)
        break
    }
    const transform = new Transform({
      position: new Vector3(0, 0.5, 0), // Move plane up to align with the in-editor preview model
      rotation: Quaternion.Euler(180, 180, 0), // Texture loads in upside down for some reason
      scale: aspectRatio
    })
    banner.addComponentOrReplace(transform)

    banner.addComponent(new PlaneShape())
    const beaconQuery = props.beacon ? '?beacon=1' : '?beacon=0'
    const baseURL = `https://forward.zesty.market/${props.network}/space/${props.space}`;
    const texture = new Texture(`${baseURL}/image/${props.format}/${props.style}${beaconQuery}`)
    const material = new Material()
    material.albedoTexture = texture
    material.transparencyMode = 1
    banner.addComponent(material)
    banner.addComponent(new OnPointerDown(
      async function () {
        openExternalURL(`${baseURL}/cta${beaconQuery}`)
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: "Visit site",
      }
    ))
  }
}