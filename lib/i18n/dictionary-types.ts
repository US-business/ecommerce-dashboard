export interface Dictionary {
    common: {
        loading: string
        save: string
        cancel: string
        delete: string
        edit: string
        add: string
        search: string
        actions: string
        status: string
        active: string
        inactive: string
        yes: string
        no: string
        home: string
        dashboard: string
        account: string
        myAccount: string
        profile: string
        changePassword: string
        about: string
        contact: string
        privacyPolicy: string
        termsOfService: string
        language: string
        upload: string
        previous: string
        next: string
        total: string
        noResults: string
        tryDifferent: string
        results: string
        pageOf: string
        sortBy: string
        newest: string
        oldest: string
        priceLowHigh: string
        priceHighLow: string
        show: string
        numberOfProducts: string
        all: string
        categories: string
        settings: string
        notifications: string
        help: string
        logout: string
        login: string
        register: string
        backToTop: string
        refresh: string
        close: string
        confirm: string
        warning: string
        info: string
        success: string
        error: string
    }
    account: {
        security: string
        superAdmin: string
        editProfilePhoto: string
        user: string
        tabs: {
            profile: string
            orders: string
        }
        profile: {
            title: string
            description: string
            username: string
            email: string
        }
        orders: {
            title: string
            description: string
            empty: string
            order: string
            orderDetails: string
            shippingAddress: string
            totalAmount: string
            status: string
            items: string
            product: string
            quantity: string
            price: string
            date: string
        }
        general: {
            back: string
            name: string
            role: string
            joinDate: string
            memberSince: string
            googleAccount: string
            localAccount: string
            security: string
            superAdmin: string
            user: string
            notSpecified: string
            saving: string
            manageGoogleAccount: string
            passwordManagedByGoogle: string
            noOrdersYet: string
            startShopping: string
        }
    }
    forms: {
        required: string
        email: {
            invalid: string
        }
        password: {
            minLength: string
        }
    }
    info: {
        addImageUrl: string
        description: string
        image: string
    }
    auth: {
        login: string
        logout: string
        signOut: string
        signIn: string
        signUp: string
        email: string
        password: string
        username: string
        loginButton: string
        loginTitle: string
        loginSubtitle: string
    }
    dashboard: {
        title: string
        revenue_over_time: string
        database_info: string
        stats: {
            total_revenue: string
            total_orders: string
            total_customers: string
            total_products: string
        }
        recent_orders: {
            title: string
            view_all: string
        }
    }
    menu: {
        title: string
        open: string
        close: string
    }
    navigation: {
        dashboard: string
        products: string
        categories: string
        orders: string
        users: string
        coupons: string
        cart: string
        reviews: string
        gallery: string
        profile: string
    }
    products: {
        title: string
        addProduct: string
        editProduct: string
        name: string
        nameEn: string
        nameAr: string
        slug: string
        sku: string
        description: string
        descriptionEn: string
        descriptionAr: string
        price: string
        addPrice: string
        discount: string
        discountType: string
        discountValue: string
        quantity: string
        brand: string
        featured: string
        size: string
        material: string
        materialAr: string
        badge: string
        badgeAr: string
        weight: string
        dimensions: string
        category: string
        color: string
        image: string
        images: string
        imageMainUpload: string
        relatedProducts: string
        allBrands: string
        priceRange: string
        statusBestSeller: string
        statusNew: string
        statusComingSoon: string
        statusOnSale: string
        statusNormal: string
    }
    categories: {
        title: string
        addCategory: string
        editCategory: string
        name: string
        nameEn: string
        nameAr: string
        slug: string
        image: string
        category: string
        allCategories: string
    }
    users: {
        title: string
        addUser: string
        editUser: string
        username: string
        email: string
        password: string
        address: string
        phoneNumber: string
        role: string
        superAdmin: string
        viewer: string
    }
    orders: {
        title: string
        orderId: string
        customer: string
        totalAmount: string
        status: string
        createdAt: string
        items: string
    }
    coupons: {
        title: string
        addCoupon: string
        editCoupon: string
        code: string
        discountType: string
        discountValue: string
        fixed: string
        percentage: string
        expiryDate: string
    }
    search: {
        title: string
        placeholder: string
        results: string
        noResults: string
        tryDifferent: string
        pageOf: string
        total: string
        filters: string
        clear: string
        apply: string
        productsFound: string
        sortBy: string
        newest: string
        oldest: string
        priceLowHigh: string
        priceHighLow: string
        show: string
        numberOfProducts: string
        all: string
        inStock: string
        outOfStock: string
        onSale: string
        priceRange: string
        availability: string
        filter: string
    }
    gallery: {
        title: string
        addGallery: string
        editGallery: string
        name: string
        nameEn: string
        nameAr: string
        slug: string
        image: string
        gallery: string
        allGalleries: string
        searchPlaceholder: string
    }
    cart: {
        title: string
        emptyCart: string
        emptyCartDescription: string
        startShopping: string
        loginRequired: string
        items: string
        products: string
        pricesIncludeVAT: string
        orderSummary: string
        acceptedPaymentMethods: string
        removeOutOfStockItems: string
        outOfStock: string
        securePayment: string
        sslProtection: string
        fastShipping: string
        deliveryTime: string
        multiplePayment: string
        paymentOptions: string
        addToCart: string
        removeFromCart: string
        quantity: string
        subtotal: string
        total: string
        checkout: string
        continueShopping: string
    }
    wishlist: {
        title: string
        emptyWishlist: string
        emptyWishlistDescription: string
        startBrowsing: string
        loginRequired: string
        items: string
        addToWishlist: string
        removeFromWishlist: string
        addAllToCart: string
        clearWishlist: string
        moveToCart: string
        productAdded: string
        productRemoved: string
        alreadyInWishlist: string
        confirmClear: string
        itemsMovedToCart: string
        viewWishlist: string
        saveForLater: string
    }
    checkout: {
        title: string
        billingInfo: string
        shippingInfo: string
        paymentMethod: string
        orderSummary: string
        placeOrder: string
        firstName: string
        lastName: string
        address: string
        city: string
        postalCode: string
        country: string
    }
    errors: {
        generic: string
        networkError: string
        serverError: string
        timeout: string
        unauthorized: string
        forbidden: string
        notFound: string
        validation: {
            required: string
            invalidEmail: string
            passwordTooShort: string
            passwordsNotMatch: string
            invalidPhoneNumber: string
            invalidUrl: string
            invalidDate: string
            minLength: string
            maxLength: string
            minValue: string
            maxValue: string
        }
    }
    notifications: {
        success: {
            saved: string
            updated: string
            deleted: string
            created: string
            sent: string
            uploaded: string
        }
        info: {
            loading: string
            processing: string
            saving: string
            uploading: string
            connecting: string
        }
        warning: {
            unsavedChanges: string
            lowStock: string
            slowConnection: string
            sessionExpiring: string
        }
    }
    dialogs: {
        confirm: {
            delete: string
            logout: string
            unsavedChanges: string
            cancel: string
        }
        titles: {
            confirmation: string
            warning: string
            error: string
            information: string
        }
        buttons: {
            ok: string
            cancel: string
            yes: string
            no: string
            save: string
            delete: string
            continue: string
            goBack: string
        }
    }
    cms: {
        home: {
            hero: {
                badge: string
                title: string
                description: string
                ctaPrimary: string
                ctaSecondary: string
                stats: {
                    customers: string
                    products: string
                    rating: string
                }
            }
            discountedProducts: {
                title: string
                subtitle: string
                viewAll: string
                upTo: string
            }
            features: {
                title: string
                subtitle: string
                items: {
                    title: string
                    description: string
                    badge: string
                }[]
                bottomCta: {
                    title: string
                    description: string
                }
            }
            testimonials: {
                title: string
                subtitle: string
                stats: {
                    customers: string
                    rating: string
                    satisfaction: string
                    support: string
                }
            }
            trustIndicators: {
                title: string
                subtitle: string
                items: {
                    title: string
                    description: string
                }[]
                badges: {
                    ssl: string
                    pci: string
                    trusted: string
                }
            }
        }
        categories: {
            title: string
            description: string
        }
        products: {
            title: string
            description: string
        }
        offers: {
            title: string
            description: string
        }
        blog: {
            title: string
            description: string
        }
        howToBuy: {
            title: string
            description: string
            shoppingGuide: string
            stepByStep: string
            whyChoose: string
            moreQuestions: {
                title: string
                description: string
            }
        }
        paymentMethods: {
            title: string
            description: string
            paymentMethodsLabel: string
            chooseMethod: string
            securityProtection: string
            methods: {
                creditCard: {
                    description: string
                }
                applePay: {
                    name: string
                    description: string
                }
                googlePay: {
                    name: string
                    description: string
                }
                bankTransfer: {
                    name: string
                    description: string
                }
                paypal: {
                    name: string
                    description: string
                }
                instant: string
                businessDays: string
                popular: string
            }
            security: {
                ssl: {
                    title: string
                    description: string
                }
                pci: {
                    title: string
                    description: string
                }
                twoFactor: {
                    title: string
                    description: string
                }
                global: {
                    title: string
                    description: string
                }
            }
            paymentFaq: {
                title: string
                description: string
                isSecure: {
                    question: string
                    answer: string
                }
                availableMethods: {
                    question: string
                    answer: string
                }
                whenCharged: {
                    question: string
                    answer: string
                }
                canCancel: {
                    question: string
                    answer: string
                }
            }
        }
        shipping: {
            title: string
            description: string
            shippingDelivery: string
            availableOptions: string
            deliveryZones: string
            features: string
            options: {
                express: {
                    name: string
                    time: string
                    cost: string
                    description: string
                }
                standard: {
                    name: string
                    time: string
                    cost: string
                    description: string
                }
                international: {
                    name: string
                    time: string
                    cost: string
                    description: string
                }
            }
            zones: {
                local: {
                    zone: string
                    time: string
                    cost: string
                    areas: string
                }
                main: {
                    zone: string
                    time: string
                    cost: string
                    areas: string
                }
                remote: {
                    zone: string
                    time: string
                    cost: string
                    areas: string
                }
            }
            shippingFeatures: {
                tracking: {
                    title: string
                    description: string
                }
                packaging: {
                    title: string
                    description: string
                }
                guarantee: {
                    title: string
                    description: string
                }
                premium: {
                    title: string
                    description: string
                }
            }
            questionsAbout: {
                title: string
                description: string
            }
        }
        about: {
            title: string
            subtitle: string
            hero: {
                title: string
                description: string
            }
            mission: {
                title: string
                description: string
            }
            values: {
                title: string
                innovation: {
                    title: string
                    description: string
                }
                quality: {
                    title: string
                    description: string
                }
                customer: {
                    title: string
                    description: string
                }
            }
            stats: {
                happyCustomers: string
                yearsExperience: string
                productsSold: string
                successRate: string
            }
            cta: {
                title: string
                description: string
                primaryButton: string
                secondaryButton: string
            }
            team: {
                title: string
                description: string
            }
        }
        contact: {
            title: string
            subtitle: string
            form: {
                name: string
                email: string
                subject: string
                message: string
                send: string
                sending: string
                success: string
                error: string
            }
            info: {
                title: string
                description: string
                address: string
                phone: string
                email: string
                hours: string
            }
            office: {
                title: string
                address: string
                phone: string
                email: string
                hours: string
            }
        }
        privacy: {
            title: string
            subtitle: string
            lastUpdated: string
            highlights: {
                dataProtection: {
                    title: string
                    description: string
                }
                privacyFirst: {
                    title: string
                    description: string
                }
                transparency: {
                    title: string
                    description: string
                }
            }
            sections: {
                introduction: {
                    title: string
                    content: string
                }
                collection: {
                    title: string
                    content: string
                }
                usage: {
                    title: string
                    content: string
                }
                sharing: {
                    title: string
                    content: string
                }
                security: {
                    title: string
                    content: string
                }
                rights: {
                    title: string
                    content: string
                }
                contact: {
                    title: string
                    content: string
                }
            }
        }
        terms: {
            title: string
            subtitle: string
            lastUpdated: string
            keyPoints: {
                legalAgreement: {
                    title: string
                    description: string
                }
                userProtection: {
                    title: string
                    description: string
                }
                clearGuidelines: {
                    title: string
                    description: string
                }
            }
            sections: {
                acceptance: {
                    title: string
                    content: string
                }
                services: {
                    title: string
                    content: string
                }
                account: {
                    title: string
                    content: string
                }
                prohibited: {
                    title: string
                    content: string
                }
                intellectual: {
                    title: string
                    content: string
                }
                limitation: {
                    title: string
                    content: string
                }
                modifications: {
                    title: string
                    content: string
                }
            }
        }
        faq: {
            title: string
            subtitle: string
            searchPlaceholder: string
            categories: {
                general: string
                orders: string
                payments: string
                returns: string
                technical: string
            }
            questions: {
                general: {
                    question: string
                    answer: string
                }[]
                orders: {
                    question: string
                    answer: string
                }[]
                payments: {
                    question: string
                    answer: string
                }[]
                returns: {
                    question: string
                    answer: string
                }[]
                technical: {
                    question: string
                    answer: string
                }[]
            }
        }
    }
    accessibility: {
        skipToContent: string
        openMenu: string
        closeMenu: string
        toggleTheme: string
        goToTop: string
        previousPage: string
        nextPage: string
        sortOptions: string
        filterOptions: string
        searchResults: string
        productImage: string
        userAvatar: string
    }
}
