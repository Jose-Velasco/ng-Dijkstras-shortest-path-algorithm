/**
* This implementation supports arbitrary keys with comparable values. To use arbitrary keys
* (such as strings or objects) first map all your keys to the integer domain [0, N) where N is the
* number of keys you have and then use the mapping with this indexed priority queue
* As convention, "key"('ki') as the index value in the domain [0, N) associated with a key k,
* therefore: key = map[k]
*/

export class MinIndexedDHeap {
  // current number of elements in the heap
  private sz: number;

  // properties should only be modifiable when an object is first created
  // readonly before the name of the property does this
  // max number of elements in the heap
  private readonly numElem: number;

  // the degree of every node in the heap
  // the number of children nodes that a parent will have
  private readonly degree: number;

  // lookup arrays to track the child/parent indexes of each node.
  private readonly child: number[];
  private readonly parent: number[];

  // the postion map(pm) maps Key Indexes(ki) to where the position of that
  // key is represented in the priority queue in the domain [0, size)
  // tell you what positon in the priotiy queue is the key in
  public readonly positionMap: number[];

  // the Inverse Map(im) stores the indexes of the keys in the range
  // [0, size) which make up the priority queue. it should be notes that
  // 'im' and 'pm' are inverses of each other, so: pm[im[i]] = im[pm[i]] = i
  // when you want to find out what Key(who is?) at a certin position just using the
  // position number in the queue
  public readonly inverseMap: number[];

  // the values associated with the keys. it is very important to note
  // that this array us indexed by the key indexes(aka 'Key' || 'ki')
  public readonly values: object[];

  // initialized a d-ary heap with a maxium capacity of maxSize
  constructor(degree: number, maxSize: number) {
    this.degree = Math.max(2, degree);
    this.numElem = Math.max(this.degree + 1, maxSize);
    this.sz = 0;

    // this should be an array of numElem size
    // BUG with the new ARRY method
    // this.inverseMap = new Array(this.numElem);
    // this.positionMap = new Array(this.numElem);
    // this.child = new Array(this.numElem);
    // this.parent = new Array(this.numElem);
    // this.values = new Array(this.numElem);
    this.inverseMap = [];
    this.positionMap = [];
    this.child = [];
    this.parent = [];
    this.values = [];

    for(let i = 0; i < this.numElem; i++) {
      this.parent[i] = Math.floor((i - 1) / this.degree);
      this.child[i] = i * this.degree + 1;
      this.positionMap[i] = this.inverseMap[i] = -1;
    }
  }

  public size(): number {
    return this.sz;
  }

  public isEmpty(): boolean {
    return this.sz == 0;
  }

  public contains(key: number): boolean {
    return this.positionMap[key] != -1;
  }

  public peekMinKeyIndex(): number {
    return this.inverseMap[0];
  }

  public pollMinKeyIndex(): number {
    const minKey: number = this.peekMinKeyIndex();
    this.delete(minKey);
    return minKey;
  }

  public peekMinValue() {
    return this.values[this.inverseMap[0]];
  }

  public pollMinValue() {
    const minValue = this.peekMinValue();
    this.delete(this.peekMinKeyIndex());
    return minValue;
  }

  public insert(key: number, value): void {
    this.positionMap[key] = this.sz;
    this.inverseMap[this.sz] = key;
    this.values[key] = value;
    this.swim(this.sz++);
  }

  public valueOf(key: number) {
    return this.values[key];
  }

  public delete(key: number) {
    const i: number = this.positionMap[key];
    this.swap(i, --this.sz);
    this.sink(i);
    this.swim(i);
    const value = this.values[key];
    this.values[key] = null;
    this.positionMap[key] = -1;
    this.inverseMap[this.sz] = -1;
    return value;
  }

  public update(key: number, value) {
    const i: number = this.positionMap[key];
    const oldValue = this.values[key];
    this.values[key] = value;
    this.sink(i);
    this.swim(i);
    return oldValue;
  }

  // Strictly decreases the value associated with 'ki' to 'value'
  public decrease(key: number, value): void {
    if(this.lessValue(value, this.values[key])) {
      this.values[key] = value;
      this.swim(this.positionMap[key]);
    }
  }

  // Strictly increases the value associated with 'ki' to 'value'
  public increase(key: number, value): void {
    if(this.lessValue(this.values[key], value)) {
      this.values[key] = value;
      this.sink(this.positionMap[key]);
    }
  }

  /* Helper functions */
  private sink(i: number): void {
    for(let j = this.minChild(i); j != -1;) {
      this.swap(i, j);
      i = j;
      j = this.minChild(i);
    }
  }

  private swim(i: number): void {
    while(this.lessNodeValue(i, this.parent[i])) {
      this.swap(i, this.parent[i]);
      i = this.parent[i];
    }
  }

  // From the parent node at index i find the minimum child below it
  private minChild(i: number): number {
    let index: number = -1;
    const from: number = this.child[i];
    const to: number = Math.min(this.sz, from + this.degree);
    for(let j = from; j < to; j++) {
      if(this.lessNodeValue(j, i)) {
        index = i = j;
      }
    }
    return index;
  }

  private swap(i: number, j: number): void {
    this.positionMap[this.inverseMap[j]] = i;
    this.positionMap[this.inverseMap[i]] = j;
    let tmp: number = this.inverseMap[i];
    this.inverseMap[i] = this.inverseMap[j];
    this.inverseMap[j] = tmp;
  }

  // Tests if the value of node i < node j
  private lessNodeValue(i: number, j: number): boolean {
    return this.values[this.inverseMap[i]] < this.values[this.inverseMap[j]];
  }

  // takes in values and test if value1 < value2
  private lessValue(value1, value2): boolean {
    return value1 < value2;
  }
}
