// @ts-nocheck

class Customer extends VendureEntity implements ChannelAware, HasCustomFields, SoftDeletable {
    constructor(input?: DeepPartial<Customer>)
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    @Column({ nullable: true })
    title: string;
    @Column() firstName: string;
    @Column() lastName: string;
    @Column({ nullable: true })
    phoneNumber: string;
    @Column()
    emailAddress: string;
    @ManyToMany(type => CustomerGroup, group => group.customers)
    @JoinTable()
    groups: CustomerGroup[];
    @OneToMany(type => Address, address => address.customer)
    addresses: Address[];
    @OneToMany(type => Order, order => order.customer)
    orders: Order[];
    @OneToOne(type => User, { eager: true })
    @JoinColumn()
    user?: User;
    @Column(type => CustomCustomerFields)
    customFields: CustomCustomerFields;
    @ManyToMany(type => Channel, channel => channel.customers)
    @JoinTable()
    channels: Channel[];
}

class StockLevel extends VendureEntity implements HasCustomFields {
    constructor(input: DeepPartial<StockLevel>)
    @Index()
    @ManyToOne(type => ProductVariant, productVariant => productVariant.stockLevels, { onDelete: 'CASCADE' })
    productVariant: ProductVariant;
    @EntityId()
    productVariantId: ID;
    @Index()
    @ManyToOne(type => StockLocation, { onDelete: 'CASCADE' })
    stockLocation: StockLocation;
    @EntityId()
    stockLocationId: ID;
    @Column()
    stockOnHand: number;
    @Column()
    stockAllocated: number;
    @Column(type => CustomStockLevelFields)
    customFields: CustomStockLevelFields;
}


class Asset extends VendureEntity implements Taggable, ChannelAware, HasCustomFields {
    constructor(input?: DeepPartial<Asset>)
    @Column() name: string;
    @Column('varchar') type: AssetType;
    @Column() mimeType: string;
    @Column({ default: 0 }) width: number;
    @Column({ default: 0 }) height: number;
    @Column() fileSize: number;
    @Column() source: string;
    @Column() preview: string;
    @Column('simple-json', { nullable: true })
    focalPoint?: { x: number; y: number };
    @ManyToMany(type => Tag)
    @JoinTable()
    tags: Tag[];
     @OneToMany(type => Collection, collection => collection.featuredAsset)
    featuredInCollections?: Collection[];
    @OneToMany(type => ProductVariant, productVariant => productVariant.featuredAsset)
    featuredInVariants?: ProductVariant[];
    @OneToMany(type => Product, product => product.featuredAsset)
    featuredInProducts?: Product[];
    @Column(type => CustomAssetFields)
    customFields: CustomAssetFields;
}

class Product extends VendureEntity implements  HasCustomFields,  SoftDeletable {
    constructor(input?: DeepPartial<Product>)
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    name: LocaleString;
    slug: LocaleString;
    description: LocaleString;
    @Column({ default: true })
    enabled: boolean;
    @Index()
    @ManyToOne(type => Asset, asset => asset.featuredInProducts, { onDelete: 'SET NULL' })
    featuredAsset: Asset;
    @EntityId({ nullable: true })
    featuredAssetId: ID;
    @OneToMany(type => ProductAsset, productAsset => productAsset.product)
    assets: ProductAsset[];
    @OneToMany(type => ProductTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Product>>;
    @OneToMany(type => ProductVariant, variant => variant.product)
    variants: ProductVariant[];
    @OneToMany(type => ProductOptionGroup, optionGroup => optionGroup.product)
    optionGroups: ProductOptionGroup[];
    @Column(type => CustomProductFields)
    customFields: CustomProductFields;
}


class Order extends VendureEntity implements ChannelAware, HasCustomFields {
    constructor(input?: DeepPartial<Order>)
    @Column('varchar', { default: OrderType.Regular })
    type: OrderType;
    @Column()
    @Index({ unique: true })
    code: string;
    @Column('varchar') state: OrderState;
    @Column({ default: true })
    active: boolean;
    @Column({ nullable: true })
    orderPlacedAt?: Date;
    @Index()
    @ManyToOne(type => Customer, customer => customer.orders)
    customer?: Customer;
    @EntityId({ nullable: true })
    customerId?: ID;
    @OneToMany(type => OrderLine, line => line.order)
    lines: OrderLine[];
    @OneToMany(type => Surcharge, surcharge => surcharge.order)
    surcharges: Surcharge[];
    @Column('simple-array')
    couponCodes: string[];
    @ManyToMany(type => Promotion, promotion => promotion.orders)
    @JoinTable()
    promotions: Promotion[];
    @Column('simple-json') shippingAddress: OrderAddress;
    @Column('simple-json') billingAddress: OrderAddress;
    @OneToMany(type => Payment, payment => payment.order)
    payments: Payment[];
    @ManyToMany(type => Fulfillment, fulfillment => fulfillment.orders)
    @JoinTable()
    fulfillments: Fulfillment[];
    @Column('varchar')
    currencyCode: CurrencyCode;
    @Column(type => CustomOrderFields)
    customFields: CustomOrderFields;
    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
    @OneToMany(type => OrderModification, modification => modification.order)
    modifications: OrderModification[];
    @Money()
    subTotal: number;
    @Money({ default: 0 })
    shipping: number;
    discounts: Discount[]
    total: number
    totalQuantity: number
}
class Role extends VendureEntity implements ChannelAware {
    constructor(input?: DeepPartial<Role>)
    @Column() code: string;
    @Column() description: string;
    @Column('simple-array') permissions: Permission[];
    @ManyToMany(type => Channel, channel => channel.roles)
    @JoinTable()
    channels: Channel[];
}

class Promotion extends AdjustmentSource implements ChannelAware, SoftDeletable, HasCustomFields, Translatable {
    type = AdjustmentType.PROMOTION;
    constructor(input?: DeepPartial<Promotion> & {
            promotionConditions?: Array<PromotionCondition<any>>;
            promotionActions?: Array<PromotionAction<any>>;
        })
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    @Column({ type: Date, nullable: true })
    startsAt: Date | null;
    @Column({ type: Date, nullable: true })
    endsAt: Date | null;
    @Column({ nullable: true })
    couponCode: string;
    @Column({ nullable: true })
    perCustomerUsageLimit: number;
    @Column({ nullable: true })
    usageLimit: number;
    name: LocaleString;
    description: LocaleString;
    @Column() enabled: boolean;
    @ManyToMany(type => Channel, channel => channel.promotions)
    @JoinTable()
    channels: Channel[];
    @ManyToMany(type => Order, order => order.promotions)
    orders: Order[];
    @Column(type => CustomPromotionFields)
    customFields: CustomPromotionFields;
    @Column('simple-json') conditions: ConfigurableOperation[];
    @Column('simple-json') actions: ConfigurableOperation[];
    @Column() priorityScore: number;
}