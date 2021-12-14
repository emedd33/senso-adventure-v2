
export type Campaign = {
    id: string,
    title: string,
    image: string
}

const Campain_1:Campaign = {
    id: "campaign_1",
    title: "Campaign 1",
    image: "https://dmdavid.com/wp-content/uploads/2019/06/Lost_Mine_of_Phandelver_cover.jpg"
}

const Campain_2: Campaign = {
    id: "campaign_2",
    title: "Campagn 2",
    image: ""
}

const content: Campaign[] = [
    Campain_1,
    Campain_2
]

export default content