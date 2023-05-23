type Key = string | number
interface FlipItem  {
    key: Key
}
interface State extends DOMRect {}
interface Options<T extends FlipItem> {
    initialState: T[]
    container: HTMLElement
    createItem: (data: T)=>HTMLElement
}
export class FlipList<T extends FlipItem> {
    private preStateMap = new Map<Key,State>;
    private curStateMap = new Map<Key,State>;
    constructor(private op: Options<T>){
        this.initItems(op.initialState)
    }
    private createList(list: Options<T>['initialState']){
        const items = list.map((data)=>{
            const el = this.op.createItem(data);
            el.dataset.flipKey = `${data.key}`
            return el
        })
        return items
    }
    private storeDomInfo(container: Map<Key, State>,items: HTMLElement[]){
         items.forEach(item=>{
            container.set(item.dataset['flipKey'] as string,item.getBoundingClientRect())
         })
    }
    private initItems(list:Options<T>['initialState'] ){
       const items = this.createList(list);
       this.op.container.append(...items);
       // First
       this.storeDomInfo(this.preStateMap,items)
    }
    private getOffset(key: Key, prop: keyof DOMRect): number{
        const preValue = this.preStateMap.get(key)?.[prop] as number;
        const curValue = this.curStateMap.get(key)?.[prop] as number;
        return preValue - curValue
    }
    private invertItems = (item: HTMLElement)=>{
        const key = item.dataset['flipKey'];
        if(key){
            const offsetX = this.getOffset(key,'x');
            const offsetY = this.getOffset(key,'y');
            // Play
            const animation = item.animate([
                {
                    transform: `translate(${offsetX}px, ${offsetY}px)`,
                },
                {
                    transform: ``,
                }
            ],{
                duration: 300,
                easing: "cubic-bezier(0,0,0.32,1)",
            })
        }
    }
    setState(newData: T[]){
        this.op.container.innerHTML = ''
        // Last
        const currentItems = this.createList(newData);
        this.op.container.append(...currentItems);
        this.storeDomInfo(this.curStateMap,currentItems);
        // invert
        currentItems.forEach(this.invertItems)
        // 重新更新容器
        this.preStateMap = new Map(this.curStateMap)
    }
}

export class Flip {
    
}