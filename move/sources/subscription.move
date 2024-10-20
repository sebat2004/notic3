module notic3::subscription {
    use sui::table::{Self, Table};
    use sui::clock::{Self, Clock};
    use std::string::{String};
    use sui::vec_map::{Self, VecMap};
    use sui::coin::{Coin};
    use sui::sui::SUI;

    //const EWrongAmount: u64 = 0;

    public struct CreatorRegistry has key {
        id: UID,
        creators: VecMap<address, ID>
    }

    public struct Creator has key, store {
        id: UID,
        creator_address: address,
        name: String,
        picture: String,
        bio: String,
    }

    public entry fun register_creator(
        registry: &mut CreatorRegistry,
        name: String,
        picture: String,
        bio: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        if (!vec_map::contains(&registry.creators, &sender)) {
            let creator = Creator { 
                id: object::new(ctx),
                creator_address: sender,
                name,
                picture,
                bio,
            };
            vec_map::insert(&mut registry.creators, creator.creator_address, object::id(&creator));
            transfer::share_object(creator);
        }
    }

    public struct CreatorSubscriptionRegistry has key {
        id: UID,
        subscriptions: vector<ID>,
    }

    public struct CreatorSubscription has key, store {
        id: UID,
        creator: address,
        title: String,
        content: vector<ID>,
        subscriptions: VecMap<address, Subscription>,
        subscription_price: u64,
        subscription_duration: u64
    }

    public struct Subscription has key, store {
        id: UID,
        creator_subscription_id: ID,
        user_public_key: vector<u8>,
        start_time: u64,
        end_time: u64
    }

    public struct Content has key, store {
        id: UID,
        blob_id: String,
        encrypted_blob_data: Table<address, EncryptedBlobData>
    }

    public struct EncryptedBlobData has key, store {
        id: UID,
        user_address: address,
        enc_iv: String,
        enc_key: String,
    }

    fun init(ctx: &mut TxContext) {
        let creatorSubscriptionRegistry = CreatorSubscriptionRegistry {
            id: object::new(ctx),
            subscriptions: vector::empty(),
        };
        transfer::share_object(creatorSubscriptionRegistry);

        let creatorRegistry = CreatorRegistry {
            id: object::new(ctx),
            creators: vec_map::empty(),
        };
        transfer::share_object(creatorRegistry);
    }

    public entry fun initialize(
        creatorSubscriptionRegistry: &mut CreatorSubscriptionRegistry,
        title: String,
        subscription_price: u64,
        subscription_duration: u64,
        ctx: &mut TxContext
    ) {
        let creator = tx_context::sender(ctx);
        let subscription = CreatorSubscription {
            id: object::new(ctx),
            creator,
            title,
            subscriptions: vec_map::empty(),
            content: vector::empty(),
            subscription_price,
            subscription_duration
        };
        vector::push_back(&mut creatorSubscriptionRegistry.subscriptions, object::id(&subscription));
        transfer::share_object(subscription);
    }

    public entry fun content(
        self: &mut CreatorSubscription,
        blob_id: String,
        user_addresses: vector<address>,
        enc_ivs: vector<String>,
        enc_keys: vector<String>,
        ctx: &mut TxContext
    ) {
        let mut new_content = Content {
            id: object::new(ctx),
            blob_id,
            encrypted_blob_data: table::new(ctx)
        };

        let mut i = 0;
        let len = vector::length(&user_addresses);
        while (i < len) {
            let user_address = *vector::borrow(&user_addresses, i);
            let enc_iv = *vector::borrow(&enc_ivs, i);
            let enc_key = *vector::borrow(&enc_keys, i);
            let d = EncryptedBlobData {
                id: object::new(ctx),
                user_address,
                enc_iv,
                enc_key
            };
            table::add(&mut new_content.encrypted_blob_data, user_address, d);
            i = i + 1;
        };
        vector::push_back(&mut self.content, object::id(&new_content));
        transfer::share_object(new_content);
    }

    public entry fun subscribe(
        creator_subscription: &mut CreatorSubscription,
        user_public_key: vector<u8>,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // assert!(&payment.value() == creator_subscription.subscription_price, EWrongAmount);

        let subscriber = tx_context::sender(ctx);
        let now = clock::timestamp_ms(clock);

        let subscription = Subscription {
            id: object::new(ctx),
            user_public_key,
            creator_subscription_id: object::uid_to_inner(&creator_subscription.id),
            start_time: now,
            end_time: now + creator_subscription.subscription_duration
        };

        transfer::public_transfer(payment, creator_subscription.creator);

        vec_map::insert(&mut creator_subscription.subscriptions, subscriber, subscription);
    }
}