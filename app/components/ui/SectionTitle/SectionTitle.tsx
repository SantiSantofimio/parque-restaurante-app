import styles from './SectionTitle.module.css'

export default function SectionTitle({
title
}:{
title:string
}){

return(
<h2 className={styles.title}>
{title}
</h2>
)

}